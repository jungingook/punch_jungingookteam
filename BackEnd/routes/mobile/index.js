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


// 1. 학생 메인 화면
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

        let logId = decoded.logId;

        connection.query(`
            select cl.id as id, cl.name as name, p.name as professor, cl.code as code, lateTime, absentTime, cl.week, cl.color, cl.design, s.id as student_id
            from professor as p
            left join classList as cl on cl.professor_id = p.id
            left join Student_has_class as sc on sc.class_id = cl.id
            left join student as s on s.id = sc.student_id
            where s.login_id = ?
        `, [logId], (err, classList) => {
            if (err) {
                console.error(err);
                throw err;
            }
            // 한 학생이 등록한 모든 수업의 목록을 가져왔다. = classList
            // 그럼 먼저 그 수업목록의 시간값을 채우고, 나서 해당 수업에 그 학생이 몇번 출결을 했는지 확인해야하낟.
            // 그러니까 출결이 먼저 들어가고. 아서 
            // 호출한 수업 각각의 모든 attendance를 호출하여 한 한생이 그 각각의 수업에 몇번 출석했는지, 몇 번 결석했는지 뽑아낸다.                        
            let classListArray = Object.values(classList);

            if (classListArray.length == 0) {
                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId },
                    secretObj.secret,
                    { expiresIn: '5h' }
                )

                let result = {
                    classList: null,
                    error: false,
                    token: newToken
                }
                res.json(result);
            } else {
                for (let j = 0; j < classListArray.length; j++) {
                    let class_id2 = classListArray[j].id;
                    let student_id = classListArray[j].student_id;

                    let attend_count = 0;
                    let late_count = 0;
                    let absent_count = 0;

                    connection.query(`
                        select att.*
                        from attendance as att
                        left join classList as cl on cl.id = att.class_id
                        where cl.id = ? and att.student_id = ?
                    `, [class_id2, student_id], (err2, result2) => {
                        if (err2) throw err2;

                        attend_count = 0;
                        late_count = 0;
                        absent_count = 0;

                        for (let i = 0; i < result2.length; i++) {
                            if (result2[i].record == '출석') {
                                attend_count++;
                            } else if (result2[i].record == '지각') {
                                late_count++;
                            } else if (result2[i].record == '결석') {
                                absent_count++
                            }
                        }

                        classList[j].attend_count = attend_count;
                        classList[j].late_count = late_count;
                        classList[j].absent_count = absent_count;
                    })

                    connection.query(`
                        select cd.startTime, cd.endTime, cd.day
                        from class_date as cd
                        left join classList as cl on cl.id = cd.class_id
                        left join Student_has_class as sc on sc.class_id = cl.id
                        left join student as s on s.id = sc.student_id
                        where cl.id = ? and s.login_id = ?
                    `, [classListArray[j].id, logId], (err3, classTime) => {
                        if (err3) {
                            console.error(err3);
                            throw err3;
                        }
                        // 한 수업에 대한 startTiem, endTime 가져 옴
                        // 그러면 해당 수업의 id를 가진 classArraydml classTime 에다 각각을 집어 넣음


                        for (let i = 0; i < classListArray.length; i++) {
                            if (classListArray[i].id == classListArray[j].id) {
                                classList[i].classTime = [];

                                for (let k = 0; k < classTime.length; k++) {

                                    let time = {
                                        startTime: classTime[k].startTime,
                                        endTime: classTime[k].endTime,
                                        day: classTime[k].day
                                    }

                                    classList[i].classTime.push(time);

                                }
                            }
                        }
                        if (j == classListArray.length - 1) {
                            // 모든 classList의 classTime속성이 채워진 상태                



                            //jwt 생성 후 전송
                            let newToken = jwt.sign(
                                { logId },
                                secretObj.secret,
                                { expiresIn: '5h' }
                            )

                            let result = {
                                classList,
                                error: false,
                                token: newToken
                            }
                            res.json(result);
                        }
                    })
                }
            }
        })
    })
})// 성공

// 2. 학생 수업 등록
// 해당 class id와 studentId를 보내주어서 
// student has class 텡블을 변경한다.
router.post('/', (req, res) => {

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
        let flag = false; // 이미 같은 걸로 연결되어 있다면?

        connection.query(`
            select s.id as student_id, sc.class_id 
            from student as s
            left join Student_has_class as sc on sc.student_id = s.id
            where s.login_id = ?
        `, [decoded.logId], (err, student) => {
            if (err) throw err;

            let studentId = student[0].student_id;
            let classListId = req.body.classListId;

            for (let i = 0; i < student.length; i++) {
                if (classListId == student[i].class_id) {
                    console.log("이미 같은 수업이 등록되어 있습니다.")
                    flag = true;
                    res.json({
                        error: true,
                        message: "이미 같은 수업이 등록되어 있습니다.",
                    });

                    return;
                }
            }

            console.log("같은 수업이 없으므로 정상적으로 추가를 실행합니다.");

            /**
             * 만약 해당 수업이 존재하지 않는다면? 이라는 예외도 처리해 주어야 한다.
             * 
             */

            connection.query(`
                select * from classList
             `, (err, classListArr) => {
                if (err) throw err;

                let isClassExist = false;
                for (let j = 0; j < classListArr.length; j++) {
                    if (classListArr[j].id == classListId) {
                        isClassExist = true;
                    }
                }

                if (!isClassExist) {
                    console.log("현재 등록되어 있지 않은 수업에 대한 요청입니다.");
                    res.json({
                        error: true,
                        message: "현재 등록되어 있지 않은 수업에 대한 요청입니다."
                    })
                    return;
                }

                connection.query(`
                    INSERT INTO Student_has_class (student_id, class_id) 
                    VALUES (?, ?);
                `, [studentId, classListId], function (err, result) {
                    if (err) throw err;

                    //jwt 생성 후 전송
                    let newToken = jwt.sign(
                        { logId: decoded.logId },
                        secretObj.secret,
                        { expiresIn: '5h' }
                    )

                    console.log("수업이 정상적으로 추가되었습니다.");
                    res.json({
                        error: false,
                        message: "수업이 정상적으로 추가되었습니다.",
                        token: newToken
                    })
                })
            })
        })
    })
}) // 성공


// 3. 학생 수업 삭제
// 단순히 방금 has테이블에서 연결고리를 끊으면 된다. 아니 행을 삭제하면 된다.
// 마찬가지로 학생의 아이디와 수업의 아이디가 요구된다.
router.delete('/', (req, res) => {
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

        connection.query(`
            select id 
            from student as s
            where s.login_id = ?
        `, [decoded.logId], (err1, student) => {
            if (err1) throw err1;

            let studentId = student[0].id;
            let classListId = req.body.classListId;

            connection.query(`
                DELETE FROM Student_has_class 
                WHERE (student_id = ?) and (class_id = ?);
            `, [studentId, classListId], function (err, result) {
                if (err) throw err;

                console.log(studentId + '이 학생의 ' + classListId + "의 수업은 삭제되었습니다.")
                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '5h' }
                )

                res.json({
                    message: '등록하 수업 삭제 성공',
                    error: 'false',
                    token: newToken
                })
            })
        })

    })
})  // 성공

module.exports = router;