const express = require('express');
const router = express.Router();

let jwt = require('jsonwebtoken');
let secretObj = require('../../config/jwt');


// //mysql 
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'dlwhdgh009',
    port: '3306',
    database: 'qrqr'
})
connection.connect();




// 4-1 preOpen
router.post('/professor/classList/qr/preOpen', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;

    if (!token) {
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) {
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }

        let class_id = req.body.class_id;

        connection.query(`
            select when_is_opened_getTime, week
            from classList
            where id = ?
        `, [class_id], (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }

            let getTime = result[0].when_is_opened_getTime;
            let week = result[0].week;

            let newToken = jwt.sign(
                { logId: decoded.logId },
                secretObj.secret,
                { expiresIn: '2h' }
            )

            res.json({
                getTime,
                week,
                error: false,
                token: newToken
            })
        })
    })
})

// 4-2. 교수 수업 개설. qr/open
router.post('/professor/classList/qr/open', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;

    if (!token) {
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) {
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }


        let {
            classListId,
            classStartTimeHour,  // 1. 교수의 수업시간, 2. 교수가 임의로 정한시간, 3. 뭐 어쨋든 잘 알아서 프론트에선 넘어온 값
            week
        } = req.body;

        console.log("프론트가 보내줘야 하는 값 목록: ")
        console.log("professor_login_id: ", decoded.logId);
        console.log("classListId: ", classListId);
        console.log("classStartTimeHour: ", classStartTimeHour);
        console.log("week: ", week);
        console.log();

        let date = classStartTimeHour;
        let flag = false; // 만약 이미 수업이 열려있는 경우 판단하는 flag이다.
        let is_none = false;    // 없는 수업을 요청하였을  경우 판단하는 값
        let is_week_already_exist = false;
        console.log("decoded.logId: ", decoded.logId)

        connection.query(`
            select cl.id, isOpened
            from classList as cl
            left join professor as p on p.id = cl.professor_id
            where p.login_id = ?
        `, [decoded.logId], (err2, classList) => {
            if (err2) {
                console.error(err2);
                throw err2;
            }

            console.log("classList: ")
            console.log(classList)
            // 해당 교수의 모든 수업을 검사한다. 다른 수업이 열려있으면 닫기 위해서.
            for (let i = 0; i < classList.length; i++) {
                if (classList[i].isOpened && classList[i].id != classListId) {
                    console.log("한 교수에서 열고 싶은 수업 이외에 다른 수업이 열려있는 경우 자동을 닫인다.");
                    connection.query(`
                        update classList
                        set isOpened = ?
                        where id = ?
                    `, [false, classList[i].id], (err3, update_result) => {
                        if (err3) {
                            console.error(err3);
                            throw err3;
                        }
                    })
                } else if (classList[i].id == classListId) {
                    is_none = true;
                    console.log("현재 개설하려는 수업이 생성되어 있음을 확인하였습니다.")
                    connection.query(`
                        update classList
                        set isOpened = ?, when_is_opened = ?, week = ?, when_is_opened_getTime = ?
                        where id = ?
                    `, [true, date, week, new Date().getTime(), classListId], (err3, update_result) => {
                        if (err3) {
                            console.error(err3);
                            throw err3;
                        }
                        console.log("유저로 부터 입력받은 값으로 수업의 속성들을 update했습니다.");

                        // 같은 회차가 존재하는지 확인해 본다.
                        connection.query(`
                            select week 
                            from week
                            where class_id = ?
                        `, [classListId], (err4, result4) => {
                            if (err4) {
                                console.error(err4);
                                throw err4;
                            }

                            for (let i = 0; i < result4.length; i++) {
                                let i_week = result4[i].week;
                                if (i_week == week) {
                                    is_week_already_exist = true;
                                    console.log("error: 현재 해당 회차는 이미 존재합니다.")
                                    break;
                                }
                            }

                            if (!is_week_already_exist) {
                                console.log("수업의 회차를 저장하려 하고 있습니다.");
                                connection.query(`
                                    INSERT INTO week (week, class_day, class_time, class_id) 
                                    VALUES (?, ?, ?, ?);
                                `, [week, new Date(), date, classListId], (err5, result5) => {
                                    if (err5) {
                                        console.error(err5)
                                        throw err5;
                                    }
                                    console.log("=====================================================");
                                    console.log(`${classListId}번째 수업의 ${week}회차가 생성되었습니다.`);
                                    console.log("=====================================================");

                                    // 해당 수업에 등록한 학생 전부 attendance를 생성한다.
                                    console.log("해당 수업에 등록한 학생 전부의 attendance를 생성하겠습니다.")
                                    connection.query(`
                                        select student_id, cl.*
                                        from Student_has_class as sc
                                        left join classList as cl on cl.id = sc.class_id
                                        where sc.class_id = ?
                                    `, [classListId], (err4, result8) => {
                                        if (err4) {
                                            console.error(err4);
                                            throw err4;
                                        }

                                        if (result8.length == 0) {
                                            // 모든 결과가 끝남
                                            let newToken = jwt.sign(
                                                { logId: decoded.logId },
                                                secretObj.secret,
                                                { expiresIn: '2h' }
                                            )

                                            res.json({
                                                message: `현재 등록된 학생이 존재하지 않습니다.`,
                                                error: false,
                                                token: newToken,
                                            })
                                            return;
                                        }

                                        let class_day = new Date();
                                        let class_time = result8[0].when_is_opened;
                                        let class_week = result8[0].week;
                                        console.log("class_day: ", class_day);
                                        console.log("class_time: ", class_time);
                                        console.log("class_week: ", class_week);


                                        console.log(`${classListId} 수업을 등록한 모든 학생의 attendance를 추가하도록 하겠습니다.`)
                                        console.log(`추가하려는 학생 목록: `)
                                        for (let i1 = 0; i1 < result8.length; i1++) {
                                            console.log(`${result8[i1].student_id} 을 생성하겠습니다.`)
                                            let student_id_i1 = result8[i1].student_id;

                                            connection.query(`
                                                insert into attendance (record, reason, created_day, created_time, updated_day, updated_time, is_verified, week_id, student_id, class_id)
                                                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                            `, ["결석", "", class_day, class_time, class_day, class_time, 0, class_week, student_id_i1, classListId], (err5, result5) => {
                                                if (err5) {
                                                    console.error(err5);
                                                    throw err5;
                                                }

                                                console.log(`${result5.insertId}번째 학생의 출석을 생성하였습니다.`)
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            }
            if (!is_none) {   // 없는 수업에 대한 요청을 할 경우
                res.json({
                    message: "없는 수업의 요청입니다.",
                    error: true
                })
                return;
            }

            if (!flag && !is_week_already_exist) {
                // 모든 결과가 끝남
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '2h' }
                )

                res.json({
                    message: `isOpened 완료`,
                    error: false,
                    token: newToken,
                    date
                })
            }
        })
    })
})



module.exports = router;

