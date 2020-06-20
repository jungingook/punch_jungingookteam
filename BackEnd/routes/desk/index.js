const express = require('express');
const router = express.Router();
const crypto = require('crypto');

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




// 1-1. sign_up 회원가입 페이지
router.post('/professor/sign_up', (req, res)=>{
    let logId = req.body.inputId;
    let password = req.body.inputPw;
    let name = req.body.inputName;
    let email = req.body.inputEmail;

    connection.query(`
        select login_id, email 
        from professor
        where login_id = ?
    `, [logId], (err, result1) => {
        if(err){
            console.error(err);
            throw err;
        }
        console.log(result1);
        if(result1.length != 0){
            res.json({
                message: "동일한 아이디를 가진 유저가 존재합니다!!",
                error: "Fail SignUp"
            });
            return;
        }
    
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");
    
        connection.query(`
            INSERT INTO professor (name, email, login_id, login_pw, salt, created_at) 
            VALUES ( ?, ?, ?, ?, ?, ?);
        `, [name, email, logId, hashPassword, salt, new Date()], function(err, result) {
            if(err){
                console.error(err);
                throw err;
            }
    
            console.log(" 교수 회원 가입 완료");
            res.json({
                message: "sign_up Success!",
                error: false
            })

            // 알아서 front에서 login화면으로 가주겠지?

        })
    })
})

// 1-2. login페이지
router.post('/professor/login', (req, res) => {   
   let logId = req.body.inputId;
   let password = req.body.inputPw;

   connection.query(`
        select login_pw, salt
        from professor
        where login_id = ?
   `, [logId], function(err, result) {
       if(err){
           console.error(err);
           throw err;           
       }

       
       if(!result || result === [] || result === null) {    // 잘못된 id로 접근할 경우 해야할 이벤트
            res.redirect('/professor/main');
            return false;
       }else {
            let dbPassword = result[0].login_pw;
            let salt = result[0].salt;       
            let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");
    
            if(hashPassword === dbPassword){
                console.log("비밀번호 일치");

                //jwt 생성 후 전송
                let token = jwt.sign(
                    { logId }, 
                    secretObj.secret, 
                    { expiresIn: '10h' }
                )
                

                res.json({
                    error: false,
                    token
                });
            }else{
                console.log("비밀번호 불일치")
                res.redirect("/desk/professor/login");
            }
       }

       
   })
})


// 2-1. 교수 수업 조회, main
router.get('/professor/main', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
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
            if(err) {
                console.error(err);
                throw err;
            }

            if(classList[0].id == null) {
                console.log("등록된 수업이 없음으로 null을 리턴하고 반환을 종료합니다.")
                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId :login_id }, 
                    secretObj.secret, 
                    { expiresIn: '10h' }
                )
                res.json({
                    classList : null,
                    message: "등록된 수업이 없습니다.",
                    token:newToken
                })
                return;
            }else{
                connection.query(`
                select * from class_date                
            `, (err2, classTime) => {
                if(err2){
                    console.error(err2);
                    throw err2;
                }

                

                for (let i = 0; i < classList.length; i++) {
                    classList[i].classTime = [];
                    for (let j = 0; j < classTime.length; j++) {
                        if(classList[i].id == classTime[j].class_id){
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
                    { logId :login_id }, 
                    secretObj.secret, 
                    { expiresIn: '10h' }
                )

                let result = {
                    classList,
                    error : false,
                    token: newToken
                }
                res.json(result);
            })
            }

            

            
        })
    })
 })

// 2-2. 교수 수업 생성
router.post('/professor/classList', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
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
            if(err) {
                console.error(err);
                throw err;
            }
            
           

            if(!result) {
                res.json({
                    message: '잘못된 토큰이 왔습니다 2, 해당 교수 아이디는 존재하지 않습니다.',
                    error: 'true'
                })
                return;
            }

            let {
                InputClassName,
                InputClassTime,
                InputClassColor,
                InputClassDesign,
                InputClassLateTime,
                InputClassAbsentTime
            } = req.body;
            
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
                if (err3){
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
                    if (err){
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
                            if(err2) {
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
router.post('/professor/classList/update', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }
        console.log("교수의 login_id: ", decoded.logId);

        let {
            classListId,
            edit_classTime,
            edit_color,
            edit_design,
            edit_lateTime,
            edit_absentTime,
            edit_week
        } = req.body;

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
        `, [edit_color, edit_design, edit_lateTime, edit_absentTime, edit_week, classListId], function(err, result) {
            if(err){
                console.error(err);
                throw err;
            }

            let class_id = classListId;

            connection.query(`
                select * from class_date
                where class_id = ?
            `, [class_id], (err2, result2) => {
                if(err2) throw err2;

                console.log(edit_classTime)
                console.log(edit_classTime[0])
                for (let i = 0; i < edit_classTime.length; i++) {
                    connection.query(`
                        update class_date
                        set startTime = ?, endTime = ?, day = ?
                        where id = ?
                    `, [edit_classTime[i].startTime, edit_classTime[i].endTime, edit_classTime[i].day, result2[i].id], (err3, result3) => {
                        if(err){
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
                    { expiresIn: '5m' }
                )
        
                console.log(classListId + "번 수업 수정 완료.");
                
                res.json({
                    message: `${classListId} 번 수업 수정 완료.`,
                    expiresIn: '5m',
                    token: newToken
                })
            })
            

            
        })
    })
});

// 2-4. 교수 수업 삭제
router.post('/professor/classList/delete', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }

        console.log("교수의 login_id: ", decoded.logId);

        let classListID = req.body.classListID;
        console.log("프론트가 보내줘야하는 값: ")
        console.log("classListID: ", classListID);
        console.log();
                
        connection.query(`
            delete from classList
            where id = ?
        `, [classListID], (err, results) => {
            if(err) throw err

             //jwt 생성 후 전송
             let newToken = jwt.sign(
                { logId: decoded.logId }, 
                secretObj.secret, 
                { expiresIn: '5m' }
            )

            console.log(classListID + "번 수업 삭제 완료.");
            res.json({
                message: `${classListID} 번 수업 삭제 완료.`,
                error: false,
                expiresIn: '5m',
                token: newToken
            })
        })
        
    })
})

// 3-1. 교수 회차 삭제
router.post('/professor/classList/week/delete', (req, res) => {
    /**
     * 특정 회차 정보를 알려주면 
     */
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }
        let logId = decoded.logId;

        let { 
            class_id, 
            week,
        } = req.body;
        console.log("class_id: ", class_id);
        console.log("week: ", week);
    
        connection.query(`
            DELETE FROM week 
            WHERE class_id = ? and week = ?;
        `, [class_id, week], (err, result) => {
            if(err){
                console.error(err);
                throw err;
            }

            connection.query(`
                delete from attendance
                where class_id = ? and week_id = ?
            `, [class_id, week], (err2, result2) => {
                if(err2){
                    console.error(err2);
                    throw err2;
                }

                console.log("해당 회차의 모든 출결 역시 삭제");
                let update_week = week - 1;
                connection.query(`
                    update classList
                    set when_is_opened = 0, when_is_opened_getTime = 0, week = ?
                    where id = ?
                `, [update_week, class_id], (err3, result3) => {

                    if(err3){
                        console.error(err3);
                        throw err3;
                    }
                    
                    console.log("해당 수업의 시작시간을 0으로 초기화했습니다.")
                    console.log("해당 수업의 회차를 1 감소시켰습니다.", week-1)
                    //jwt 생성 후 전송
                    let token = jwt.sign(
                        { logId }, 
                        secretObj.secret, 
                        { expiresIn: '10h' }
                    )

                    console.log("해당 회차가 삭제되었습니다.")
                    res.json({
                        error: false,
                        token,
                        message: "해당 회차가 삭제되었습니다."
                    });
                })
            })
        })
    })
})

// 4-1. 교수 출결 조회, 교수가 자신의 과목에 대한 전 회차 또는 각 회차 출결리스트 반환
router.post('/professor/classList/attendance', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }
        

        // let professor_id = req.body.professor_ID;
        let class_id = req.body.classListID;
        let week = req.body.att_week;        
        console.log("프론트에서 특정 수업의 출결을 알고 싶은 경우 주어야하는 파라미터 값들: ")
        console.log("class_id: ", class_id);
        console.log("att_week: ", week, "이 값은 없다면 모든 회차의 출결을 알고싶은 경우이다.");
        console.log("");
        

        if (week) {  // 특정 회차의 출결을 보고싶은 경우
            console.log("회차가 있다.")
            connection.query(`
                select att.id as attendance_id, att.record as studentState, st.name, st.no as studentNo, att.created_day, att.created_time,att.updated_day, att.updated_time, is_fingerprint, is_gtx, is_qr, is_passive, is_verified, we.class_day, we.class_time
                from attendance as att
                left join student as st on st.id = att.student_id
                left join week as we on we.week = att.week_id
                where att.class_id = ? and att.week_id = ? and we.class_id = ?
            `, [class_id, week, class_id], (err, attendanceArr) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                
                let attend_count = 0;
                let late_count = 0;
                let absent_count = 0;

                if(attendanceArr.length == 0) {
                    console.log("Warning: 현재 등록된 학생이 없어 출결의 정보를 반환할 수 없습니다.")
                    let att_arr = [];
                    let class_day = null;
                    let class_time = null;
                    //jwt 생성 후 전송
                    let newToken = jwt.sign(
                        { logId: decoded.logId },
                        secretObj.secret,
                        { expiresIn: '5m' }
                    )
                    res.json({
                        att_arr,
                        attend_count,
                        late_count,
                        absent_count,
                        class_day, 
                        class_time,
                        token: newToken,
                        error: false,
                        message: `Warning: 현재 등록된 학생이 없어 출결의 정보를 반환할 수 없습니다.`
                    })
                    return;
                }

                let att_arr = Object.values(attendanceArr);
                let class_day = attendanceArr[0].class_day;
                let class_time = attendanceArr[0].class_time;

                for (let i = 0; i < att_arr.length; i++) {
                    if(att_arr[i].studentState == '출석')  {
                        attend_count++;
                    } else if(att_arr[i].studentState == '지각') {
                        late_count++;
                    } else if(att_arr[i].studentState == '결석') {
                        absent_count++;
                    }
                }                

                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '5m' }
                )

                console.log("한 회차의 모든 출결 정보 배열: ", att_arr);
                console.log("한 회차의 모든 출석 정보: ", attend_count);
                console.log("한 회차의 모든 지각 정보: ", late_count);
                console.log("한 회차의 모든 결석 정보: ", absent_count);

                res.json({
                    att_arr,
                    attend_count,
                    late_count,
                    absent_count,
                    class_day, 
                    class_time,
                    token: newToken,
                    error: false,
                    message: `${class_id} 번 수업 Open.`
                })
            })
        } else {     // 전 회차의 각각의 회차의 모든 출결 정보 return;
            console.log("회차가 없다..")            
            connection.query(`
                select * 
                from week as we
                where we.class_id = ?
                group by we.week
                order by we.week
            `, [class_id], (err1, week_result) => {
                if(err1) {
                    console.error(err1);
                    throw err1;
                }

                let attendance_count = 0;
                let late_count = 0;
                let absent_count = 0;
                let week_object = {};

                let result_arr = [];
                if(week_result.length == 0) {
                    //jwt 생성 후 전송
                    let newToken = jwt.sign(
                        { logId: decoded.logId },
                        secretObj.secret,
                        { expiresIn: '5h' }
                    )

                    let result10 = {
                        result_arr,
                        error:false, 
                        message: "잘 보내짐",
                        token: newToken
                    }
                    res.json(result10)
                }else {
                    for (let i = 0; i < week_result.length; i++) {                    
                        connection.query(`
                            select * 
                            from attendance as att
                            where att.week_id = ? and class_id = ?
                        `, [week_result[i].week, class_id], (err2, attendance_result) => {
                            if(err2){
                                console.error(err2);
                                throw err2;                            
                            }
    
                            
    
                            for (let j = 0; j < attendance_result.length; j++) {                            
                                if(attendance_result[j].record == '출석') {
                                    attendance_count++;
                                }else if(attendance_result[j].record == '지각') {
                                    late_count++;
                                }else if(attendance_result[j].record == '결석') {
                                    absent_count++;
                                }
                            }
                            week_object = {
                                week: week_result[i].week,
                                day: getDate(week_result[i].class_day),
                                time: week_result[i].class_time,
                                attendance_count,
                                late_count,
                                absent_count
                            }
                            result_arr.push(week_object);
                            
                            attendance_count = 0;
                            late_count = 0;
                            absent_count = 0;
    
                            if(i == week_result.length - 1) {
                                //jwt 생성 후 전송
                                let newToken = jwt.sign(
                                    { logId: decoded.logId },
                                    secretObj.secret,
                                    { expiresIn: '5h' }
                                )
    
                                let result10 = {
                                    result_arr,
                                    error:false, 
                                    message: "잘 보내짐",
                                    token: newToken
                                }
                                res.json(result10)
                            }
                        })                    
                    }
                }

                
            })
        
            
        
            
        }    
    })
})

// 4-2. 교수 출결 수정, 교수가 수동으로 출석 변경
router.post('/professor/classList/attendance/modify', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
            res.json({
                message: '잘못된 토큰이 왔습니다.',
                error: true
            })
            return;
        }


        let {
            att_id,            
            record, 
            reason
        } = req.body;            

        connection.query(`
            update attendance
            set record = ?, reason = ?, is_verified = 1
            where id = ?
        `, [record, reason, att_id], (err1, result1) => {
            if(err1) throw err1;

            //jwt 생성 후 전송
            let newToken = jwt.sign(
                { logId: decoded.logId },
                secretObj.secret,
                { expiresIn: '5m' }
            )

            res.json({
                error: false,
                message: "특정 출결 변경이 성공했습니다.",
                token: newToken
            })
        })
    
    })
})

// 5-1 preOpen
router.post('/professor/classList/qr/preOpen', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
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
            if(err) {
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

// 5-2. 교수 수업 개설. qr/open
router.post('/professor/classList/qr/open', (req, res)=> {
    let token = req.headers['x-access-token'] || req.query.token;
    
    if(!token){
        res.json({
            message: '토큰이 없습니다.',
            error: 'true'
        })
        return;
    }
    jwt.verify(token, secretObj.secret, (err, decoded) => {
        if(err){
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
            if(err2) {
                console.error(err2);
                throw err2;
            }

            console.log("classList: ")
            console.log(classList)
            // 해당 교수의 모든 수업을 검사한다. 다른 수업이 열려있으면 닫기 위해서.
            for (let i = 0; i < classList.length; i++) {
                if( classList[i].isOpened && classList[i].id != classListId ) {
                    console.log("Warning: 한 교수에서 열고 싶은 수업 이외에 다른 수업이 열려있는 경우 자동을 닫인다.");
                    connection.query(`
                        update classList
                        set isOpened = ?
                        where id = ?
                    `, [false, classList[i].id], (err3, update_result) => {
                        if(err3) {
                            console.error(err3);
                            throw err3;
                        }
                    })
                } else if ( classList[i].id == classListId ) {
                    is_none = true; 
                    console.log("현재 개설하려는 수업이 생성되어 있음을 확인하였습니다.")
                    connection.query(`
                        update classList
                        set isOpened = ?, when_is_opened = ?, week = ?, when_is_opened_getTime = ?
                        where id = ?
                    `, [true, date, week, new Date().getTime(), classListId], (err3, update_result) => {
                        if(err3) {
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
                            if(err4) {
                                console.error(err4);
                                throw err4;
                            }

                            for (let i = 0; i < result4.length; i++) {
                                let i_week = result4[i].week;
                                if(i_week == week) {
                                    is_week_already_exist = true;
                                    console.log("error: 현재 해당 회차는 이미 존재합니다.")
                                    break;
                                }
                            }

                            if(!is_week_already_exist){
                                console.log("수업의 회차를 저장하려 하고 있습니다.");
                                connection.query(`
                                    INSERT INTO week (week, class_day, class_time, class_id) 
                                    VALUES (?, ?, ?, ?);
                                `, [week, new Date(), date, classListId], (err5, result5) => {
                                    if(err5){
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
                                        if(err4) {
                                            console.error(err4);
                                            throw err4;                                    
                                        }

                                        if(result8.length == 0) {
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
                                                if(err5){
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
            if(!is_none) {   // 없는 수업에 대한 요청을 할 경우
                res.json({
                    message: "없는 수업의 요청입니다.",
                    error: true
                })
                return;
            }

            if(!flag && !is_week_already_exist){
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



function getDate(date) {
    let year = date.getUTCFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let result = (year +"-" + month+"-"+day)

    return result;
}


module.exports = router;

