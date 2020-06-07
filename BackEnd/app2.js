const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port  = 3000;
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');

let jwt = require('jsonwebtoken');
let secretObj = require('./config/jwt');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());
// //mysql 
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'dlwhdgh009',
    port: '3306',
    database: 'qrqr'
})
connection.connect()




app.use(cookieParser())

// session
app.use(session({
    key: 'session_key',
    secret: '1', // 세션을 암호화 해줌
    resave: false, // 세션을 항상 저장할지 여부를 정하는 값. (false 권장)
    saveUninitialized: true,// 초기화되지 않은채 스토어에 저장되는 세션
    store: new MySQLStore({ // 데이터를 저장되는 형식
        host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
        user:'admin',
        password: 'dlwhdgh009',
        port: '3306',
        database: 'qrqr'
    })
}));

// Router 설정
app.use('/desk', require('./routes/desk/jwt_index'));
app.use('/mobile', require('./routes/mobile'));


// Part. python

app.post('/python/login', (req, res) => {   
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
        console.log(result);
        
        if(result.length == 0) {    // 잘못된 id로 접근할 경우 해야할 이벤트
            console.log("잘못됭 id로 접근")
             res.json({
                 error:true,
                 message: "잘못된 id로 접근"
             })
             return;
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
                console.log("잘못된 비밀번호로 접근")
                res.json({
                    error: true,
                    message: "비밀번호 불일치"
                })
                return false;
             }
        }
    })
 })

// 6-1 python요청
app.post('/python/qr', (req , res) => {
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

        let prof_id = decoded.logId;

        connection.query(`
            select isOpened, code, when_is_opened
            from classList as cl
            left join professor as p on p.id = cl.professor_id
            where p.login_id = ?
        `, [prof_id], (err, result) => {
            if(err) throw err;

            let flag = false;
            let index = -1;

            for (let i = 0; i < result.length; i++) {            
                console.log("result[0].isOpened = " + result[0].isOpened)
                
                if(result[i].isOpened){
                    console.log("현재 특정 수업이 열렸음을 확인하였습니다. 해당 수업의 코드는: ", result[i].code, " 입니다.");
                    flag = true;
                    index = i;
                    break;
                }
            }

            if(flag) {
                let attendanceTime = result[index].when_is_opened;  //현재 시간 -> 인국이 형이 보내는 시간 기주능러 할 것
                let perceptionTime = attendanceTime%60;  // 지각 시간 
                attendanceTime = Math.floor(attendanceTime / 60);
                console.log("현재 열려있는 수업의 시작 시간: ", attendanceTime);
                console.log("현재 열려있는 수업의 분  시간 : ", perceptionTime);
    
                let qrJsonPack = {   
                    error: false,                 
                    randomNum: randomArray[0].rn +'' + result[index].code,
                    attendanceTime: attendanceTime,
                    perceptionTime: perceptionTime
                }
    
                res.json(qrJsonPack);
            } else {
                res.json({
                    error: true,
                    message : "현재 어떤 수업도 열지 않았습니다."
                })
            }
        })
    })
})


// Part. Professor


// 6. 1초 마다 들어오는 qr 요청
app.post('/desk/professor/classList/qr/request', (req, res) => {
    
    let classListID = req.body.classListId;
    console.log("프론트가 보내줘야 하는 값, classListId : ", classListID);

    // 먼저 해당 과목의 isOpened가 true인지 확인한다.
    connection.query(`
        select isOpened, code, when_is_opened
        from classList
        where id  = ?
    `,  [classListID], function(err, result){
        if(err) {
            console.error(err);
            throw err;
        }

        
        if(result[0].isOpened == 1){

            let attendanceTime = result[0].when_is_opened;  // 교수가 설정한 수업 시작 시간.
            attendanceTime = Math.floor(attendanceTime / 60);

            let qrJsonPack = {   
                error: false,                 
                randomNum: randomArray[0].rn +'' + result[0].code,
                attendanceTime: attendanceTime
            }

            res.json(qrJsonPack);

        } else if(result[0].isOpened == 0){
            console.log("현재 해당 과목은 개설되지 않았습니다. 임시값 10000000000를 보냅니다.");

            let attendanceTime = new Date().getTime();

            let qrJsonPack = {                    
                error: true,
                randomNum: -1,
                attendanceTime: attendanceTime
            }

            res.json(qrJsonPack);
        } else{
            console.log("isOpened값을 잘못 확인하였다. 수정 요망");
            res.send('isOpened값을 잘못 확인하였다. 수정 요망')
        }
    }) 
})


// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------



// Part. Student

// 1. 학생 메인 화면
app.get('/mobile/student/main', (req ,res) => {
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

        let logId = decoded.logId;

        connection.query(`
            select cl.id as id, cl.name as name, p.name as professor, cl.code as code, lateTime, absentTime, cl.week, cl.color, cl.design, s.id as student_id
            from professor as p
            left join classList as cl on cl.professor_id = p.id
            left join Student_has_class as sc on sc.class_id = cl.id
            left join student as s on s.id = sc.student_id
            where s.login_id = ?
        `, [logId], (err, classList) => {
            if(err) {
                console.error(err);
                throw err;
            }
            // 한 학생이 등록한 모든 수업의 목록을 가져왔다. = classList
            // 그럼 먼저 그 수업목록의 시간값을 채우고, 나서 해당 수업에 그 학생이 몇번 출결을 했는지 확인해야하낟.
            // 그러니까 출결이 먼저 들어가고. 아서 
            // 호출한 수업 각각의 모든 attendance를 호출하여 한 한생이 그 각각의 수업에 몇번 출석했는지, 몇 번 결석했는지 뽑아낸다.                        
            let classListArray = Object.values(classList);

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
                    if(err2) throw err2;
                    
                    attend_count = 0;
                    late_count = 0;
                    absent_count = 0;

                    for (let i = 0; i < result2.length; i++) {
                        if(result2[i].record == '출석') {
                            attend_count++;
                        } else if(result2[i].record == '지각') {
                            late_count++;
                        } else if(result2[i].record == '결석') {
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
                `,[classListArray[j].id, logId],  (err3, classTime) => {
                    if(err3){
                        console.error(err3);
                        throw err3;
                    }
                    // 한 수업에 대한 startTiem, endTime 가져 옴
                    // 그러면 해당 수업의 id를 가진 classArraydml classTime 에다 각각을 집어 넣음
                    

                    for (let i = 0; i < classListArray.length; i++) {
                        if(classListArray[i].id == classListArray[j].id){
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
                    if(j == classListArray.length - 1){
                        // 모든 classList의 classTime속성이 채워진 상태                
                        
                        
    
                        //jwt 생성 후 전송
                        let newToken = jwt.sign(
                            { logId }, 
                            secretObj.secret, 
                            { expiresIn: '5h' }
                        )
    
                        let result = {
                            classList,
                            error : false,
                            token: newToken
                        }
                        res.json(result);
                    }
                })
            }
        })
    }) 
})// 성공

// 2. 학생 수업 등록
// 해당 class id와 studentId를 보내주어서 
// student has class 텡블을 변경한다.
app.post('/mobile/student/class', (req, res) => {

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
        let flag = false; // 이미 같은 걸로 연결되어 있다면?

        connection.query(`
            select s.id as student_id, sc.class_id 
            from student as s
            left join Student_has_class as sc on sc.student_id = s.id
            where s.login_id = ?
        `, [decoded.logId], (err, student) => {
            if(err) throw err;

            let studentId = student[0].student_id;
            let classListId = req.body.classListId;

            for (let i = 0; i < student.length; i++) {
                if(classListId == student[i].class_id) {
                    console.log("이미 같은 수업이 등록되어 있습니다.")
                    flag = true;
                    res.json({
                        error: true,
                        message : "이미 같은 수업이 등록되어 있습니다.",                        
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
                if(err) throw err;

                let isClassExist = false;
                for (let j = 0; j < classListArr.length; j++) {
                    if(classListArr[j].id == classListId) {
                        isClassExist = true;
                    }
                }

                if(!isClassExist) {
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
                `, [studentId, classListId], function(err, result) {
                    if(err) throw err;

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
app.post('/mobile/student/class/delete', (req, res) => {
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

        connection.query(`
            select id 
            from student as s
            where s.login_id = ?
        `, [decoded.logId], (err1, student) => {
            if(err1) throw err1;

            let studentId = student[0].id;
            let classListId = req.body.classListId;

            connection.query(`
                DELETE FROM Student_has_class 
                WHERE (student_id = ?) and (class_id = ?);
            `, [studentId, classListId], function(err, result) {
                if(err) throw err;

                console.log(studentId+'이 학생의 '+ classListId+"의 수업은 삭제되었습니다.")
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


// 4. 학생 qr코드 인증 req
app.post('/mobile/qr/verify', (req, res) => {
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

        
        let login_id = decoded.logId; // student_login_id

        connection.query(`
            select s.id as id, class_id
            from student as s
            left join Student_has_class as sc on sc.student_id = s.id
            where s.login_id = ?
        `, [login_id], (err, student) => {
            if(err) throw err;

            let studentID = student[0].id;
            let {
                qrNum,
                allowTime  // allowTime 은 밀리초 단위, 방금 학생이 찍었을 때 시간                
            } = req.body;

            

            console.log("프론트에서 보내줘야 하는 값: ")
            console.log("qrNum: ", qrNum);
            console.log("allowTime: ", allowTime);
            // console.log("current_student_time: ", current_student_time);
     
            console.log();
            
            let current_hour = new Date().getHours();
            let current_minute = new Date().getMinutes();
            let current_student_time = ((current_hour * 60) + current_minute);
            
            // qrNum의 뒤에 3자리(수업 코드는 따로 떼어낸다.)
            qrNum = qrNum+"";
            let onlyRandomNum = qrNum.substring(0, 10);
            let classCode = Math.floor(qrNum.substring(10, qrNum.length));
            console.log("classCode = " + classCode);

            connection.query(`
                select * 
                from classList as cl 
                where cl.code = ?
            `,[classCode], (err4, result4) => {
                if(err4) throw err4;

                // 해당 학생이 이 수업을 듣고있는 지 확인
                let is_have_class = false;
                let is_have_class_index = 0;
                for (let ii = 0; ii < student.length; ii++) {
                    if(student[ii].class_id == result4[0].id) {
                        is_have_class = true;
                        is_have_class_index = ii;
                        break;
                    }                    
                }
                // 만약 없다면 추가해주고 마저 진행
                if(!is_have_class) {
                    console.log("새로운 등록이 필요한 학생입니다.")
                    connection.query(`
                        INSERT INTO Student_has_class (student_id, class_id) 
                        VALUES (?, ?);                    
                    `, [student[is_have_class_index].id, result4[0].id], (err7, result7) => {
                        if(err7) {
                            console.error(err7)
                            throw err7;
                        }
                        console.log(" ")
                        console.log(`${student[is_have_class_index].id}번 째 학생과 ${result4[0].id}의 수업을 이어주었습니다.`)
                        console.log(" ")

                        let class_day_1 = new Date();
                        let class_time_1 = result4[0].when_is_opened;
                        let class_week_1 = result4[0].week;
                        let student_id_1 = studentID;
                        let class_id_1 = result4[0].id;
                        console.log("새로 출결을 만드는데 필요한 값들 목록: ");
                        console.log("class_day_1: ", class_day_1);
                        console.log("class_time_1: ", class_time_1);
                        console.log("class_week_1: ", class_week_1);
                        console.log("student_id_1: ", student_id_1);
                        console.log("class_id_1: ", class_id_1);

                        console.log("11111111111111111111111111111111111111111")
                        // 해당 학생의 attendance를 새로 추가해줘야함
                        connection.query(`
                            insert into attendance (record, reason, created_day, created_time, updated_day, updated_time, is_verified, week_id, student_id, class_id)
                            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, ["결석", "", class_day_1, class_time_1, class_day_1, class_time_1, 0, class_week_1, student_id_1, class_id_1], (err7, result7) => {
                            if(err7) {
                                console.error(err7);
                                throw err7;
                            }
                            console.log("22222222222222222222222222222222222222222222222")

                            let classStartTimeHour = result4[0].when_is_opened; 

                            console.log("global처리가 잘 되었는지? classStartTimeHour = "+ classStartTimeHour);
                            console.log("qr인증 test");        
                    
                            // 현재 db의 classList의 상태 역시 확인한다.
                            checkClassStatus(classCode, classStartTimeHour, onlyRandomNum, allowTime, current_student_time, studentID, res);
                        })

                        
                    })
                } else {
                    console.log("이미 등록된 학생입니다!!!")
                    let classStartTimeHour = result4[0].when_is_opened; 

                    console.log("global처리가 잘 되었는지? classStartTimeHour = "+ classStartTimeHour);
                    console.log("qr인증 test");        
            
                    // 현재 db의 classList의 상태 역시 확인한다.
                    checkClassStatus(classCode, classStartTimeHour, onlyRandomNum, allowTime, current_student_time, studentID, res);
                }                
            })
        })
    })
})  //실제로 테스트 해 봐야하는 ** 가장 중요

// 현재 db의 classList의 상태 역시 확인한다.
function checkClassStatus(classCode, classStartTimeHour, onlyRandomNum, allowTime, current_student_time, studentID, res) {
    // 현재 db의 classList의 상태 역시 확인한다.
    console.log("333333333333333333333333333333333333333333333333333333")
    connection.query(`
        select isOpened, id, week, lateTime, absentTime
        from classList
        where code = ?
    `, [classCode],  function(err, result){
        if(err) throw err;

        // 현재 학생이 qr검사를 재시도하는 것은 아닌지 확인한다.
        console.log("44444444444444444444444444444444444444444444444444444444444")
        connection.query(`
            select is_verified
            from attendance as att
            where week_id = ? and student_id = ? and class_id = ?
        `, [result[0].week, studentID, result[0].id], (err0, result0) => {
            if(err0) {
                console.error(err0);
                throw err0;
            }

            console.log("특정 학생의 출결 정보: ")
            console.log("재시도인지?")
            if(result0[0].is_verified == 1) {
                console.log("현재 요청은 재시도 입니다. error를 내보냅니다.")
                console.log("5555555555555555555555555555555555555555555555555555555555555555555")

                res.json({
                    error: true,
                    message: "현재 학생은 qr검사를 재시도하고 있습니다. 해당 요청은 거부됩니다."
                })
                return;
            }
            else {
                console.log("현재 요청은 재시도가 아닙니다. 정상적으로 요청을 진행합니다.");
                console.log("666666666666666666666666666666666666666666666666666666666666666666666")

                

                console.log("result[0].week = "  +result[0].week);        
                    
                let classStartTimeMinute = (classStartTimeHour*1) % 60; // 나머지를 구함으로써 분(minute)을 구한다.
                classStartTimeHour = Math.floor(classStartTimeHour / 60);

                console.log("classStartTimeHour: "+classStartTimeHour);
                console.log("classStartTimeMinute: " +classStartTimeMinute);

                // 변수에 classList의 상태를 저장한다.
                let classIsOpened = result[0].isOpened;
                console.log("classIsOpened = ", classIsOpened);

                // 받은 QR_난수, 허용_시간, 수업_시작_시, 수업_시작_분
                
                let isAllow =  checkRandomArray(onlyRandomNum, allowTime, classStartTimeHour, classStartTimeMinute, result[0].lateTime, result[0].absentTime);
                console.log("isAllow = " + isAllow);
                
                // 실제 출결을 업데이트 하는 함수
                updateAttendanceFunc(isAllow, classIsOpened, current_student_time, result, studentID, res)
            }
        })        
    })
}

// 실제 출결을 업데이트 하는 함수
function updateAttendanceFunc(isAllow, classIsOpened, current_student_time, result, studentID, res) {
    console.log("88888888888888888888888888888888888888888888888888888888888888888888888888888")  
    // class의 상태와 시간 값, 난수 값 모두 일치한다면 
    if(isAllow == 2 && classIsOpened){      // week속성 값을 update해주어야 한다.
        // db에 해당 요청의 학생의 attendance를 출석 update한다.
        connection.query(`
            UPDATE attendance 
            SET record = ?, reason = ?, created_day = ?, created_time = ?, updated_day = ?, updated_time = ?, is_verified = 1
            WHERE week_id = ? and student_id = ? and class_id = ?
        `,["출석", " ", new Date(), current_student_time, new Date(), current_student_time, result[0].week, studentID, result[0].id], function(err2, result2){
            if(err2) {
                console.error(err2);
                throw err2;
            }
            // 출석 입력 완료
            console.log("result[0].id = "+result[0].id)
            console.log("출석 변경 완료. ")
            res.send("출석")
        })
    } else if(isAllow == 1 && classIsOpened){
        // db에 해당 요청의ㅣ 학생의 attendance를 지각으로 update한다.
        connection.query(`
            UPDATE attendance 
            SET record = ?, reason = ?, created_day = ?, created_time = ?, updated_day = ?, updated_time = ?, is_verified = 1
            WHERE week_id = ? and student_id = ? and class_id = ?
        `,["지각", "출석 인정 시간 초과", new Date(), current_student_time, new Date(), current_student_time, result[0].week, studentID, result[0].id], function(err2, result2){
            if(err2) {
                console.error(err2);
                throw err2;
            }
            // 지각 입력 완료
            console.log("지각 입력 완료. ")
            res.send("지각")
        })
    } else if (isAllow == 0 && classIsOpened){
        // db에 해당 요청의 학생 attendance를 결석으로 update한다.
        connection.query(`
            UPDATE attendance 
            SET record = ?, reason = ?, created_day = ?, created_time = ?, updated_day = ?, updated_time = ?, is_verified = 1
            WHERE week_id = ? and student_id = ? and class_id = ?
        `,["결석", "출석 시간으로 부터 15분이 흘러갔습니다.",  new Date(), current_student_time, new Date(), current_student_time, result[0].week, studentID, result[0].id], function(err2, result2){
            if(err2) {
                console.error(err2);
                throw err2;
            }
            // 결석 입력 완료
            console.log("결석 입력 완료. ")
            res.send("결석")
        })
    } else {
        console.log("isAllow = ",isAllow);
        console.log("classIsOpened = ",classIsOpened);
    }
}

function getDate(date) {
    let year = date.getUTCFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let result = (year +"-" + month+"-"+day)

    return result;
}

// 5. 학생 출석 현황 보기
app.post('/mobile/student/class/attendance', (req, res) => {
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

        connection.query(`
            select * 
            from student 
            where student.login_id = ?;
        `, [decoded.logId], (err2, student) => {
            if(err2) throw err2;

            let student_id = student[0].id;
            let class_id = req.body.classListID;
            console.log("프론트가 보내줘야하는 값: classListID: ", class_id);

    
            // 해당 학생의 해당 과목의 출석 결과를 보여준다.
            connection.query(`
                select cl.name, att.week_id, att.id as attendance_id ,att.record,
                    att.reason, att.created_day, att.updated_day,
                    att.is_fingerprint, att.is_gtx, att.is_passive, att.is_qr 
                from attendance as att                
                left join classList as cl on cl.id = att.class_id
                where att.student_id = ? and att.class_id = ?
            `, [ student_id, class_id], (err, result) => {
                if(err){
                    console.error(err);
                    throw err;
                }
                result = Object.values(result);

                let attend_count = 0;
                let late_count = 0;
                let absent_count = 0;

                for (let i = 0; i < result.length; i++) {                    
                    let student1 = result[i];
                    student1.createdDay = getDate(student1.created_day);
                    student1.updatedDay = getDate(student1.updated_day);
                    
                    console.log(student1);

                    if(student1.record == '출석') {
                        attend_count++;
                    } else if(student1.record == '지각') {
                        late_count++;
                    } else if(student1.record == '결석') {
                        absent_count++;
                    }
                }

                result = {
                    result,
                    attend_count,
                    late_count,
                    absent_count
                }
                
                res.json(result);
            })
        })
            
        
    })
})


// 6. 학생 로그인 
app.post('/mobile/student/login', (req, res) => {
    let {
        inputId,
        inputPw
    } = req.body;

    connection.query(`
        select login_pw, salt
        from student
        where login_id = ?
    `, [inputId], (err, student) => {
        if(err) {
            console.error(err);
            throw err;
        }

        if(!student || student == [] || student == null) {
            console.log("등록된 id가 없습니다.")
            res.json({
                message: "등록된 id가 없습니다.",
                error: true
            })
            return;
        }

        let dbPassword = student[0].login_pw;
        let salt = student[0].salt;
        let hashPassowrd = crypto.createHash("sha512").update(inputPw + salt).digest("hex");

        if(hashPassowrd === dbPassword) {
            console.log('비밀번호 일치');

             //jwt 생성 후 전송
             let token = jwt.sign(
                { logId:inputId }, 
                secretObj.secret, 
                { expiresIn: '5h' }
            )
            console.log("token = ");
            console.log(token);

            res.json({
                error: false,
                token
            });
        } else {
            console.log("비밀번호 불일치");
            res.json({
                message: '비밀번호 불일치',
                error: true
            })
        }
    })
})


// 7. 학생 회원가입
app.post('/mobile/student/sign_up', (req, res) => {
    let {
        inputId,
        inputPw,
        inputName,
        inputEmail,
        inputNo     // 학번
    } = req.body;

    connection.query(`
        select login_id, email
        from student
        where login_id = ?
    `, [inputId], (err, student) => {
        if(err) {
            console.error(err);
            throw err;
        }
        console.log("student = ");
        console.log(student);

        if(student[0]){
            console.log("동일한 아이디를 가진 유저가 존재합니다.");
            res.json({
                message : "동일한 아이디를 가진 유저가 존재합니다.",
                error: true
            })
            return;
        }

        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassowrd = crypto.createHash("sha512").update(inputPw + salt).digest("hex");

        connection.query(`
            insert into student (name, email, login_id, login_pw, salt, created_at, no)
            values (?, ?, ?, ?, ?, ?, ?);
        `, [inputName, inputEmail, inputId, hashPassowrd, salt, new Date(), inputNo], (err1, insertStudent) => {
            if(err1) {
                console.error(err1);
                throw err1;
            }

            console.log("학생 회원 가입 완료");
            res.json({
                message: 'student sign_up success',
                error: false
            })
        })
    })
})



// 난수 메소드

// 난수 배열 객체 생성 함수
var randomArray = new Array();

// 난수 객체 선언
class RandomObject{
    constructor(n, t){
        this.rn = n;
        this.ct = t;
    }
}

// 난수 객체 배열 초기화
function initRandomArray(){
    for(let i = 0; i < 65; i++ ){
        let min = Math.ceil(1000000000);  //10억 10자리
        let max = Math.floor(10000000000);    //100억 11자리
        let randomNum =  Math.floor(Math.random() * (max - min)) + min;   //10자리의 랜덤 값

        let time = new Date();
        let currentTime = time.getTime(); //밀리초 단위로 환산  
        

        randomArray.push(new RandomObject(randomNum, currentTime));
    }
}

// 여기에 출석인지 지각인지 결석인지를 결정한다.
// 그러면 출석 인정시간을 db에서 가져와야 한다.
// 현재 배열에서 같은 값이 있는지 검증 한다.
function  checkRandomArray( qrNum, allowTime, startTimeHour, startTimeMinute, lt, at){  
    console.log("77777777777777777777777777777777777777777777777777777777777777777777777777")  
    console.log("check Random Array start, the parameters is...")
    console.log("qrNum: ", qrNum)
    console.log("allowTime: ", allowTime)
    console.log("startTimeHour: ", startTimeHour)
    console.log("startTimeMinute: ", startTimeMinute)
    console.log("lt: ", lt)
    console.log("at: ", at)
    console.log("  ")

    // 검증1 배열 앞부분의 5개의 RandomObject를 꺼낸다.
    firstRandomObject = randomArray[0];
    secondRandomObject = randomArray[1];
    thirdRandomObject = randomArray[2];
    fourthRandomObject = randomArray[3];
    fifthRandomObject = randomArray[4];

    // 5번째 값의 ct + 5초의 값이 allowTime보다 큰지 먼저 검사
    console.log("5번째 값의 ct + 5초의 값이 allowTime보다 큰지 먼저 검사")
    console.log("fifthRandomObject.ct + 5000 > allowTime: ", (fifthRandomObject.ct + 5000 > allowTime))
    console.log("fifthRandomObject.ct + 5000: ", (fifthRandomObject.ct + 5000))
    console.log("allowTime: ", allowTime)
    if(fifthRandomObject.ct + 5000 > allowTime){
        // 통과하면 5개의 넘 값중에 같은 난수값이 있는지 확인
        console.log("통과하면 5개의 넘 값중에 같은 난수값이 있는지 확인")
        console.log("firstRandomObject.rn == qrNum || secondRandomObject.rn == qrNum || thirdRandomObject.rn == qrNum || fourthRandomObject.rn == qrNum || fifthRandomObject.rn == qrNum: ", (firstRandomObject.rn == qrNum || secondRandomObject.rn == qrNum || thirdRandomObject.rn == qrNum || fourthRandomObject.rn == qrNum || fifthRandomObject.rn == qrNum))
        console.log("firstRandomObject.rn: ", firstRandomObject.rn)
        console.log("secondRandomObject.rn: ", secondRandomObject.rn)
        console.log("thirdRandomObject.rn: ", thirdRandomObject.rn)
        console.log("fourthRandomObject.rn: ", fourthRandomObject.rn)
        console.log("fifthRandomObject.rn: ", fifthRandomObject.rn)

        if( firstRandomObject.rn == qrNum || secondRandomObject.rn == qrNum || thirdRandomObject.rn == qrNum || fourthRandomObject.rn == qrNum || fifthRandomObject.rn == qrNum){
            // 출석인지 지각인지 결석인지 결정

            // 현재의 년, 월, 일을 구하자.
            let currentYear = new Date().getUTCFullYear();
            let currentMonth = new Date().getMonth();
            let currentDate = new Date().getDate();

            // 먼저 비교 가능하게 1970년 이후의 밀로초 값으로 만들자
            let testCurrentTime = new Date(currentYear, currentMonth, currentDate, startTimeHour, startTimeMinute, 0);
            console.log("testCurrentTime : ");
            console.log(testCurrentTime)

            let millie1970StartTime = testCurrentTime.getTime();//수업시간
            millie1970StartTime = millie1970StartTime;
            
            // 출석이라면 수업시간 <=  현재 시간 
            // 수업시간 
            // 출석이라면 startTime + 5분 보다 5번째 랜덤 객체의 createTime이 작아야 한다.
           

            let mTime = minusTime(fifthRandomObject.ct, millie1970StartTime);
            console.log("mtime = ", mTime)
            // console.log(" mTime < lateTime = ",  mTime < lateTime, typeof(mTime) )
            if( mTime < lt){                
                
                // 2 == 출석
                console.log('출석')
                return 2;
            } else if( mTime < at){
                // 1 == 지각
                console.log('지각')
                return 1;
            } else{
                // 0 == 결석
                console.log('결석')
                return 0;
            }
        }
    }
    return -1;
}

function minusTime(a, b) {
    a = (a / 60000) + 540;
    b = (b / 60000)
    return a - b;
}

// 배열의 앞부부을 지우고 뒷 부분을 새로 만드는
function doingChange(){
    let min = Math.ceil(1000000000);  //10억 10자리
    let max = Math.floor(10000000000);    //100억 11자리
    let randomNum =  Math.floor(Math.random() * (max - min)) + min;   //10자리의 랜덤 값
    // randomNum = 1000000000;


    let time = new Date();
    let currentTime = time.getTime(); //밀리초 단위로 환산
    // console.log("randomNum : " +randomNum + ",  currentTIme : " + currentTime + "\n")
    // console.log("randomNum, currentTime : " + randomNum + ", " + currentTime);
    
    // 새로운 값을 추가하고
    randomArray.unshift(new RandomObject(randomNum, currentTime));

    // 가장 오래된, 뒤에 있는 값을 제거한다.
    randomArray.pop();
}

// 특정 함수를 1초마다 반복한다.
function doingChangeOneSecond(){
    setInterval(doingChange, 1000);
}

// 배열의 값을 프린트한다.
function printArray(){
    console.log("\nfirst rannum: " + randomArray[0].rn);
    console.log("first createTime: " + randomArray[0].ct);

    console.log("second rannum: " + randomArray[1].rn);
    console.log("second createTime: " + randomArray[1].ct);    

    console.log("third rannum: " + randomArray[2].rn);
    console.log("third createTime: " + randomArray[2].ct+"\n");
}

// 1초마다 배열의 값을 확인한다.
function printOneSecond(){
    setInterval(printArray, 1000)
}



initRandomArray();  // 난수 배열 65개? 값 채움
doingChangeOneSecond(); // 배열의 값을 1초마다 바꾸기

//  listen

app.listen(port, function(){
    console.log(`app2 is listening on port: ${port}`)
})



// //s3
// const path = require('path')
// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const AWS = require('aws-sdk')

// // 이미지 저장경로, 파일명 세팅
// const upload = multer({      
//     storage: multerS3({
//         s3: s3,
//         bucket: "storyline-image-bucket", // 버킷 이름
//         contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
//         acl: 'public-read-write', // 클라이언트에서 자유롭게 가용하기 위함
//         key: (req, file, cb) => {            
//           let extension = path.extname(file.originalname);
//           console.log('file : ' + file);
//           console.log('extension : ' + extension);
//           cb(null, Date.now().toString() + file.originalname)
//         },
//     }),
//     limits: { fileSize: 12 * 1024 * 1024 }, // 용량 제한 5MByte
// });


