const express = require('express');
const router = express.Router();
const crypto = require('crypto');

let jwt = require('jsonwebtoken');
let secretObj = require('../../config/jwt');
// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const bodyParser = require('body-parser');

global.classStartTimeHour;  // 수업 개설 시 main에 보내줘야하는 값



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


// 1. 교수 메인창
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

            console.log("시간 값이 채워지기 전 classList = ");
            console.log(classList);

            connection.query(`
                select * from class_date                
            `, (err2, classTime) => {
                if(err2){
                    console.error(err2);
                    throw err2;
                }

                console.log("classTime = ");
                console.log(classTime);

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
                console.log("채워진 후의 classList = ")
                console.log(classList);

                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId :login_id }, 
                    secretObj.secret, 
                    { expiresIn: '5m' }
                )

                let result = {
                    classList,
                    error : false,
                    token: newToken
                }
                res.json(result);
            })
        })
    })
 })

// 2. 교수 수업 생성
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
                    message: '잘못된 토큰이 왔습니다 2',
                    error: 'true'
                })
                return;
            }
            console.log("result = ")
            console.log(result);

            let {
                InputClassName,
                InputClassCode,
                InputClassTime,
                inputClassColor,
                InputClassDesign,
                inputClassLateTime,
                inputClassAbsentTime,
                inputClassWhenIsOpened
            } = req.body;
            
            let inputPrfessorId = result[0].id;
            

            let arr = [
                InputClassName,
                InputClassCode,
                inputClassColor,
                InputClassDesign,
                inputClassLateTime,
                inputClassAbsentTime,
                inputPrfessorId
            ];
            console.log("Arr = ");//
            console.log(arr);//

            connection.query(`
                INSERT INTO classList (name, code, color, design, lateTime, absentTime, professor_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, arr, (err, result1) => {
                if (err){
                    console.error(err);
                    throw err;
                } 

                let class_id = result1.insertId;

                for (let i = 0; i < InputClassTime.length; i++) {
                    connection.query(`
                        insert into class_date (startTime, endTime, day, class_id)
                        values (?, ?, ?, ?)
                    `, [InputClassTime[i].startTime, InputClassTime[i].endTime, InputClassTime[i].day, class_id], (err2, result2) => {
                        if(err2) {
                            console.error(err2);
                            throw err2;
                        }
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
    });
})

// 3. 교수 수업 수정
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


        let {
            classListId,
            edit_classTime,
            edit_color,
            edit_design,
            edit_lateTime,
            edit_absentTime,
            edit_week
        } = req.body;
    
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

// 4. 교수 수업 삭제
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

        let classListID = req.body.classListID;

                
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

// 5. 교수 수업 개설.classStartTimeHour
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
            classStartTimeHour  // 1. 교수의 수업시간, 2. 교수가 임의로 정한시간, 3. 뭐 어쨋든 잘 알아서 프론트에선 넘어온 값
        } = req.body;

        global.classStartTimeHour = classStartTimeHour; // 글로벌 변수에 넣는다.
        console.log("global.classStartTimeHour = " + global.classStartTimeHour + "글로벌 변수에 잘 들어갔는지 확인");

        let flag = false; // 만약 이미 수업이 열려있는 경우 판단하는 flag이다.
        let date = classStartTimeHour;
        let is_none = false;    // 없는 수업을 요청하였을  경우 판단하는 값
        
    
        connection.query(`
            select cl.id, week, isOpened
            from classList as cl
            left join professor as p on p.id = cl.professor_id
            where p.login_id = ?
        `, [decoded.logId], (err2, classList) => {
            if(err2) {
                console.error(err2);
                throw err2;
            }

            console.log("classList = ");
            console.log(classList)
            console.log(decoded.logId)

            for (let i = 0; i < classList.length; i++) {
                if( classList[i].isOpened && classList[i].id != classListId ) {
                    // 한 교수에서 열고 싶은 수업 이외에 다른 수업이 열려있는 경우 자동을 닫인다.
                    console.log("한 교수에서 열고 싶은 수업 이외에 다른 수업이 열려있는 경우 자동을 닫인다.");
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
                } else if( classList[i].isOpened && classList[i].id == classListId ) {
                    // 이미 생성되었는데도 불구하고 다시 요청을 하는 경우
                    console.log("이미 생성되었는데도 불구하고 다시 요청을 하는 경우");
                    flag = true;

                    let newToken = jwt.sign(
                        { logId: decoded.logId }, 
                        secretObj.secret, 
                        { expiresIn: '3h' }
                    )
        
                    is_none = true;
                    res.json({
                        message: `이미 수업이 열려 있습니다.`,
                        error: true,
                        token: newToken
                    })
                    return;

                } else if( !classList[i].isOpened && classList[i].id == classListId ) {
                    // 원하는 수업이 안열렸을 경우 수업의 isOpened값을 true로 변경한다.
                    console.log("원하는 수업이 안열렸을 경우 수업의 isOpened값을 true로 변경한다.");
                    is_none = true;

                    connection.query(`
                        update classList
                        set isOpened = ?, when_is_opened = ?
                        where id = ?
                    `, [true, date, classListId], (err3, update_result) => {
                        if(err3) {
                            console.error(err3);
                            throw err3;
                        }

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

            if(!flag){
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

/**
 * 
 * //jwt 생성 후 전송
            let newToken = jwt.sign(
                { logId: decoded.logId }, 
                secretObj.secret, 
                { expiresIn: '5m' }
            )

            res.json({
                message: `${classListID} 번 수업 Open.`,
                error: false,
                expiresIn: '5m',
                token: newToken
            })
 */

// 6. 1초 마다 들어오는 qr 요청
// app.post('/desk/professor/classList/qr/request', (req, res) => {

// 7. 교수가 자신의 과목에 대한 모든 출결현황 보기
// app.post('/desk/professor/classList/attendance', (req, res) => {
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
        console.log("week = " + week);

        if (week) {  //특정한 회차의 출결을 보고싶은 경우
            connection.query(`
                select * from attendance as att
                left join classList as cl on att.class_id = cl.id
                where cl.id = ? and att.att_week = ?;
            `, [class_id, week], (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }

                // res.json(result);

                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '5m' }
                )
                console.log("attendance = ")
                console.log(result);

                res.json({
                    attendance: result,
                    token: newToken,
                    error: false,
                    message: `${class_id} 번 수업 Open.`
                })
            })
        } else {
            connection.query(`
                select * from attendance as att
                left join classList as cl on att.class_id = cl.id
                where cl.id = ?;
            `, [class_id], (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }

                // res.json(result);

                //jwt 생성 후 전송
                let newToken = jwt.sign(
                    { logId: decoded.logId },
                    secretObj.secret,
                    { expiresIn: '5m' }
                )
                console.log("attendance = ")
                console.log(result);

                res.json({
                    attendance: result,
                    token: newToken,
                    error: false,
                    message: `${class_id} 번 수업 Open.`
                })
            })
        }    
    })
})

// 8. 교수가 수동으로 출석 변경
// app.post('/desk/professor/classList/attendance/modify', (req, res) => {
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


        let attendance_id = req.body.attendance_ID;
        let edit_record = req.body.edit_record;
        let edit_reason = req.body.edit_reason;
    
        // 변경은 recored와 reason을 변경한다.
        // 특정 날짜를 알 수 있어야 한다. 아니 attendanceID만 알고 있으면 변경할 수 있다 어차피 이 url에 접근할 수 있는 유저는 해당 교수밖에 없으므로.    
        connection.query(`
            UPDATE attendance 
            SET record = ?, reason = ? 
            WHERE id = ?
        `, [edit_record, edit_reason, attendance_id], (err, result)=> {
            if(err){
                console.error(err);
                throw err;
            }
    
            //jwt 생성 후 전송
            let newToken = jwt.sign(
                { logId: decoded.logId }, 
                secretObj.secret, 
                { expiresIn: '5m' }
            )

            res.json({
                token: newToken,
                error: false,
                
            })
        })
    
    })
})


// 9. sign_up 회원가입 페이지
router.post('/professor/sign_up', (req, res)=>{
    let logId = req.body.inputId;

    connection.query(`
        select login_id, email 
        from professor
        where login_id = ?
    `, [logId], (err, result1) => {
        if(err){
            console.error(err);
            throw err;
        }

        if(result1){
            res.json({
                message: "동일한 아이디를 가진 유저가 존재합니다!!",
                error: "Fail SignUp"
            });
            return;
        }

        let password = req.body.inputPw;
        let name = req.body.inputName;
        let email = req.body.inputEmail;
    
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


// 10. login페이지
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
                    { expiresIn: '2h' }
                )
                console.log("token = ");
                console.log(token);

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

// 11. logout 페이지
router.get("/professor/logout", (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;

    if(!token) {
        res.json({
            message: "Success Logout!",
            error: false
        })
    } else {
        res.json({
            message: "Fail Logout..",
            error: true
        })
    }
})

// 12. test용 logout page만들기
router.get('/professor/logout', (req, res) => {
    let html = `
    <h1>logout</h1>

    <form action="http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout" method="POST">
        <input type="submit" value="logout">
    </form>
`;
    res.send(html);
    
})





module.exports = router;