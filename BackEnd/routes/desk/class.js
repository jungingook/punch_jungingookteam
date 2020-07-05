const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretObj = require('../../config/jwt');

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

// 2-1. 교수 수업 조회, main
router.get('/', (req, res) => {
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
        console.log(decoded);

        let login_id = decoded.logId;
        console.log("클라이언트가 줘야하는 정보: login_id: ", login_id);


        connection.query(`
            select cl.id as id, cl.name as name, p.name as professor, cl.code as code, lateTime, absentTime, cl.week, cl.color, cl.design
            from professor as p
            left join classList as cl on cl.professor_id = p.id
            where p.login_id = ?
        `, [login_id], (err, classList) => {
            if (err) {
                console.error(err);
                throw err;
            }

            if (classList[0].id == null) {
                console.log("등록된 수업이 없음으로 null을 리턴하고 반환을 종료합니다.")
                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: login_id },
                    secretObj.secret,
                    { expiresIn: '10h' }
                )
                res.json({
                    classList: null,
                    message: "등록된 수업이 없습니다.",
                    token: newToken
                })
                return;
            } else {
                connection.query(`
                select * from class_date                
            `, (err2, classTime) => {
                    if (err2) {
                        console.error(err2);
                        throw err2;
                    }



                    for (let i = 0; i < classList.length; i++) {
                        classList[i].classTime = [];
                        for (let j = 0; j < classTime.length; j++) {
                            if (classList[i].id == classTime[j].class_id) {
                                let time = {
                                    startTime: classTime[j].startTime,
                                    endTime: classTime[j].endTime,
                                    day: classTime[j].day
                                }

                                classList[i].classTime.push(time);
                            }
                        }
                    }
                    // 모든 classList의 classTime속성이 채워진 상태


                    //jwt 생성 후 전송
                    let newToken = jwt.sign(
                        { logId: login_id },
                        secretObj.secret,
                        { expiresIn: '10h' }
                    )

                    let result = {
                        classList,
                        error: false,
                        token: newToken
                    }
                    res.json(result);
                })
            }
        })
    })
})

// 2-2. 교수 수업 생성
router.post('/', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;

    let {
        InputClassName,
        InputClassTime,
        InputClassColor,
        InputClassDesign,
        InputClassLateTime,
        InputClassAbsentTime
    } = req.body;

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

        console.log(decoded);
        // 시작
        connection.query(`
            select login_id , id
            from professor
            where login_id = ?
        `, [decoded.logId], (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }



            if (!result) {
                res.json({
                    message: '잘못된 토큰이 왔습니다 2, 해당 교수 아이디는 존재하지 않습니다.',
                    error: 'true'
                })
                return;
            }



            let InputPrfessorId = result[0].id;

            console.log("프론트가 수업 생성 시 보내줘야 하는 값들 목록: ");
            console.log("professor_login_id: ", decoded.logId);
            console.log("InputClassName: ", InputClassName);
            console.log("InputClassTime: ", InputClassTime);
            console.log("InputClassColor: ", InputClassColor);
            console.log("InputClassDesign: ", InputClassDesign);
            console.log("InputClassLateTime: ", InputClassLateTime);
            console.log("InputClassAbsentTime: ", InputClassAbsentTime);
            console.log(" ");

            connection.query(`
                select id 
                from classList 
                order by id desc limit 1
            `, (err3, result3) => {
                if (err3) {
                    console.error(err3);
                    throw err3;
                }
                let class_code = result3[0].id + 1;
                console.log("실제 수업의 code값: ", class_code)

                let arr = [
                    InputClassName,
                    class_code,
                    InputClassColor,
                    InputClassDesign,
                    InputClassLateTime,
                    InputClassAbsentTime,
                    InputPrfessorId
                ];

                connection.query(`
                    INSERT INTO classList (name, code, color, design, lateTime, absentTime, professor_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                `, arr, (err, result1) => {
                    if (err) {
                        console.error(err);
                        throw err;
                    }

                    let class_id = result1.insertId;
                    console.log("생성된 수업의 id를 가져온다: ", class_id)

                    for (let i = 0; i < InputClassTime.length; i++) {
                        connection.query(`
                            insert into class_date (startTime, endTime, day, class_id)
                            values (?, ?, ?, ?)
                        `, [InputClassTime[i].startTime, InputClassTime[i].endTime, InputClassTime[i].day, class_id], (err2, result2) => {
                            if (err2) {
                                console.error(err2);
                                throw err2;
                            }

                            console.log("수업의 날짜가 잘 저장되었다.")

                        })
                    }

                    console.log(InputClassName + "수업 생성 완료");

                    //jwt 생성 후 전송
                    let newToken = jwt.sign(
                        { logId: decoded.logId },
                        secretObj.secret,
                        { expiresIn: '5m' }
                    )

                    res.json({
                        message: '수업 생성 성공',
                        error: 'false',
                        token: newToken
                    })

                })
            })
        })
    });
})

// 2-3. 교수 수업 수정
router.put('/', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;

    let {
        classListId,
        edit_classTime,
        edit_color,
        edit_design,
        edit_lateTime,
        edit_absentTime,
        edit_week
    } = req.body;

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
        console.log("교수의 login_id: ", decoded.logId);



        console.log("프론트가 보내줘야하는 값 목록들: ")
        console.log("classListId: ", classListId);
        console.log("edit_classTime: ", edit_classTime);
        console.log("edit_color: ", edit_color);
        console.log("edit_design: ", edit_design);
        console.log("edit_lateTime: ", edit_lateTime);
        console.log("edit_absentTime: ", edit_absentTime);
        console.log("edit_week: ", edit_week);
        console.log();

        connection.query(`
            update classList 
            set color = ?, design = ?, lateTime = ?, absentTime = ?, week = ?
            where (id = ?)
        `, [edit_color, edit_design, edit_lateTime, edit_absentTime, edit_week, classListId], function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }

            let class_id = classListId;

            connection.query(`
                select * from class_date
                where class_id = ?
            `, [class_id], (err2, result2) => {
                if (err2) throw err2;

                console.log(edit_classTime)
                console.log(edit_classTime[0])
                for (let i = 0; i < edit_classTime.length; i++) {
                    connection.query(`
                        update class_date
                        set startTime = ?, endTime = ?, day = ?
                        where id = ?
                    `, [edit_classTime[i].startTime, edit_classTime[i].endTime, edit_classTime[i].day, result2[i].id], (err3, result3) => {
                        if (err) {
                            console.error(err3);
                            throw err3;
                        }

                        console.log(`${result2[i].id} start, endTime is updated!`)
                    })
                }

                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '5h' }
                )

                console.log(classListId + "번 수업 수정 완료.");

                res.json({
                    message: `${classListId} 번 수업 수정 완료.`,
                    token: newToken
                })
            })



        })
    })
})

// 2-4. 교수 수업 삭제
router.delete('/', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    let classListID = req.body.classListID;

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

        console.log("교수의 login_id: ", decoded.logId);

        
        console.log("프론트가 보내줘야하는 값: ")
        console.log("classListID: ", classListID);
        console.log();

        connection.query(`
            delete from classList
            where id = ?
        `, [classListID], (err, results) => {
            if (err) throw err

            //jwt 생성 후 전송
            let newToken = jwt.sign(
                { logId: decoded.logId },
                secretObj.secret,
                { expiresIn: '5h' }
            )

            console.log(classListID + "번 수업 삭제 완료.");
            res.json({
                message: `${classListID} 번 수업 삭제 완료.`,
                error: false,
                token: newToken
            })
        })

    })
})

module.exports = router;