const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port  = 3000;
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');

let jwt = require('jsonwebtoken');
let secretObj = require('./config/jwt');


const corsOptions = {
    origin: 'http://54.180.113.64',
    credentials: true 
};

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



app.use(methodOverride('_method'))

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


// Part. Professor

// 1. 교수 메인창
// app.get('/desk/professor/main', (req, res) => {


// 2. 교수 수업 생성 실행
// app.post('/desk/professor/classList', (req, res) => {


// 3. 교수 수업 수정,    _ 오직 startTime, endTime, color, design만 변경가능
// app.post('/desk/professor/classList/update', (req, res) => {


// 4. 교수 수업 삭제
// app.post('/desk/professor/classList/delete', (req, res) => {


// let _attendanceTime; // 출석시간
// 5. 교수 수업 qr코드 생성
// app.post('/desk/professor/classList/qr/open', (req, res) => {


// 6. 1초 마다 들어오는 qr 요청
app.post('/desk/professor/classList/qr/request', (req, res) => {
    
        let classListID = req.body.classListId;

        /**
         * 
         * 형이 클래스 id값과, week값을 보내준다면
         * 나는 그 값을 가지고, 그냥 주고. '
         * 난수 값을 그냥 주고, 
         */

        // 먼저 해당 과목의 isOpened가 true인지 확인한다.
        connection.query(`
            select isOpened, code 
            from classList
            where id  = ?
        `,  [classListID], function(err, result){
            if(err) throw err;
    
            
            if(result[0].isOpened == 1){
    
                let attendanceTime = new Date().getTime();  //현재 시간 -> 인국이 형이 보내는 시간 기주능러 할 것
                let perceptionTime = attendanceTime + (5*60*1000);  // 지각 시간
    
                let qrJsonPack = {
                    id: 1,
                    randomNum: randomArray[0].rn +'' + result[0].code,
                    attendanceTime: attendanceTime,
                    perceptionTime: perceptionTime
                }
    
                res.json(qrJsonPack);
            } else if(result[0].isOpened == 0){
                console.log("현재 해당 과목은 개설되지 않았습니다. 임시값 10000000000를 보냅니다.");
    
                let attendanceTime = new Date().getTime();
                let perceptionTime = attendanceTime + (5*60*1000);
    
                let qrJsonPack = {
                    id: 1,
                    randomNum: 10000000000101,
                    attendanceTime: attendanceTime,
                    perceptionTime: perceptionTime
                }
    
                res.json(qrJsonPack);
            } else{
                console.log("isOpened값을 잘못 확인하였다. 수정 요망");
                res.send('isOpened값을 잘못 확인하였다. 수정 요망')
            }
        }) 
    
    
})

// 7. 교수가 자신의 과목에 대한 모든 출결현황 보기
// app.post('/desk/professor/classList/attendance', (req, res) => {


// 8. 교수가 수동으로 출석 변경
// app.post('/desk/professor/classList/attendance/modify', (req, res) => {


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
            select cl.id as id, cl.name as name, p.name as professor, cl.code as code, lateTime, absentTime, cl.week, cl.color, cl.design
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
                    { logId }, 
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
        let flag = false;

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
                        { expiresIn: '5m' }
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
                    { expiresIn: '5m' }
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

        console.log(decoded);
        // let login_id = req.body.login_id;
        let login_id = decoded.logId;
        connection.query(`
            select * from student as s
            where s.login_id = ?
        `, [login_id], (err, student) => {
            if(err) throw err;

            let studentID = student[0].id;
            let {
                qrNum,
                allowTime,  // allowTime 은 밀리초 단위, 방금 학생이 찍었을 때 시간
                 
            } = req.body;


            let classStartTimeHour = global.classStartTimeHour;// 형이 보내준 기준 시간 값 =--> 내가 전역변수로 해서 알아서 처리
            console.log("global처리가 잘 되었는지? classStartTimeHour = "+ classStartTimeHour);

            console.log("qr인증 test");
    
            // qrNum의 뒤에 3자리(수업 코드는 따로 떼어낸다.)
            qrNum = qrNum+"";
            let onlyRandomNum = qrNum.substring(0, qrNum.length - 3);
            let classCode = qrNum.substring(qrNum.length - 3, qrNum.length);
    
    
            // 현재 db의 classList의 상태 역시 확인한다.
            connection.query(`
                select isOpened, id 
                from classList
                where code = ?
            `, [classCode], function(err, result){
                if(err) throw err;
    
    
                // db에서 해당 클래스의 출석 인정 시간을 가져오자
                // let classStartTimeHour = (result[0].startTime*1) / 60; //시간 값으로 바꿈 ex) 10 => 오전 10시, 아마 getHour()했을 때도 비슷하지 않았나..
                // classStartTimeHour = classStartTimeHour-9;  // 시간 차이 미국 시간으로 들어오나 봄   
                
                    
                let classStartTimeMinute = (classStartTimeHour*1) % 60; // 나머지를 구함으로써 분(minute)을 구한다.
                classStartTimeHour = Math.floor(classStartTimeHour / 60);

                console.log("classStartTimeHour: "+classStartTimeHour);
                console.log("classStartTimeMinute: " +classStartTimeMinute);
    
                // 변수에 classList의 상태를 저장한다.
                let classIsOpened = result[0].isOpened;
    
                // 받은 QR_난수, 허용_시간, 수업_시작_시, 수업_시작_분
                
                let isAllow = checkRandomArray(onlyRandomNum, allowTime, classStartTimeHour, classStartTimeMinute);
    
                // class의 상태와 시간 값, 난수 값 모두 일치한다면 
                if(isAllow == 2 && classIsOpened){      // week속성 값을 update해주어야 한다.
                    // db에 해당 요청의 학생의 attendance를 출석 update한다.
                    connection.query(`
                        insert into attendance (record, createdDay, updatedDay, reason, class_id, student_id)
                        values ("출석", ?, ?, "", ?, ?)
                    `,[new Date(), new Date(), result[0].id, studentID], function(err2, result2){
                        if(err2) {
                            console.error(err2);
                            throw err2;
                        }
                        // 출석 입력 완료
                        console.log("출석 입력 완료. ")
                        res.send("출석");
                    })
                } else if(isAllow == 1 && classIsOpened){
                    // db에 해당 요청의ㅣ 학생의 attendance를 지각으로 update한다.
                    connection.query(`
                        insert into attendance (record, createdDay, updatedDay, reason, class_id, student_id)
                        values ("지각", ?, ?, "출석 인정 시간 초과", ?, ?)
                    `,[new Date(), new Date(), result[0].id, studentID], function(err2, result2){
                        if(err2) {
                            console.error(err2);
                            throw err2;
                        }
                        // 지각 입력 완료
                        console.log("지각 입력 완료. ")
                        res.send("지각");
                    })
                } else{
                    // db에 해당 요청의 학생 attendance를 결석으로 update한다.
                    connection.query(`
                        insert into attendance (record, createdDay, updatedDay, reason, class_id, student_id)
                        values ("결석", ?, ?, "출석 시간으로 부터 15분이 흘러갔습니다.", ?, ?)
                    `,[new Date(), new Date(), result[0].id, studentID], function(err2, result2){
                        if(err2) {
                            console.error(err2);
                            throw err2;
                        }
                        // 결석 입력 완료
                        console.log("결석 입력 완료. ")
                        res.send("결석");
                    })
                }
            })
        })
            
        
    })

})  //실제로 테스트 해 봐야하는 ** 가장 중요

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

    
            // 해당 학생의 해당 과목의 출석 결과를 보여준다.
            connection.query(`
                select cl.name, att.week_id, att.id as attendance_id ,att.record, att.reason, att.createdDay, att.updatedDay, att.is_fingerprint, att.is_gtx, att.is_passive, att.is_qr from attendance as att
                left join week as we on we.week  = att.week_id
                left join classList as cl on cl.id = we.class_id
                where cl.id = ? and att.student_id = ?
            `, [ class_id, student_id], (err, result) => {
                if(err){
                    console.error(err);
                    throw err;
                }

                let attend_count = 0;
                let late_count = 0;
                let absent_count = 0;

                for (let i = 0; i < result.length; i++) {                    
                    let student1 = result[i];
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
                    ...result,
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
function checkRandomArray( qrNum, allowTime, startTimeHour, startTimeMinute){    
    // 검증1 배열 앞부분의 5개의 RandomObject를 꺼낸다.
    firstRandomObject = randomArray[0];
    secondRandomObject = randomArray[1];
    thirdRandomObject = randomArray[2];
    fourthRandomObject = randomArray[3];
    fifthRandomObject = randomArray[4];

    // 5번째 값의 ct + 5초의 값이 allowTime보다 큰지 먼저 검사
    if(fifthRandomObject.ct + 5000 > allowTime){
        // 총과하면 5개의 넘 값중에 같은 난수값이 있는지 확인
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
            
            // 출석이라면 수업시간 <=  현재 시간 
            // 수업시간 
            // 출석이라면 startTime + 5분 보다 5번째 랜덤 객체의 createTime이 작아야 한다.            
            if((fifthRandomObject.ct - millie1970StartTime)/60000 < 5){                
                // 2 == 출석
                return 2;
            } else if((fifthRandomObject.ct - millie1970StartTime)/60000 < 15){
                // 1 == 지각
                return 1;
            } else{
                // 0 == 결석
                return 0;
            }
        }
    }
    return 0;
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


