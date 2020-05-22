const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port  = 3000;
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


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


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.use(cors());
app.use(cookieParser())

// session
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret', // 세션을 암호화 해줌
    resave: false, // 세션을 항상 저장할지 여부를 정하는 값. (false 권장)
    saveUninitialized: false,// 초기화되지 않은채 스토어에 저장되는 세션
    store: new MySQLStore({ // 데이터를 저장되는 형식
        host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
        user:'admin',
        password: 'dlwhdgh009',
        port: '3306',
        database: 'qrqr'
    })
}));

// Router 설정
app.use('/desk', require('./routes/desk'));
app.use('/mobile', require('./routes/mobile'));


// ID, PW test
app.post('/test/login', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;

    let a = {
        tt: 1
    }

    if(id == 101 && pw == 200){
        console.log("ok");
        console.log(a);
        res.json(a);
        
    }else if(id && pw){
        console.log("id or pw doesnt come");
        console.log(id);
        console.log(pw);
        res.send("what?")
        
    }else{
        console.log("this is wha?")
        console.log(id);
        console.log(pw);
        
    }
})


//router

app.get('/desk/qr', (req, res) => {
    let min = Math.ceil(1000000000);  //10억 10자리
    let max = Math.floor(10000000000);    //100억 11자리
    let randomNum =  Math.floor(Math.random() * (max - min)) + min;   //10자리의 랜덤 값

    let time = new Date();
    let currentTime = time.getTime(); //밀리초 단위로 환산

    let fiveM = 5 * 60 * 1000;
    let attendanceTime = currentTime
    let perceptionTime = currentTime + fiveM



    let  subjectCode = 100;
    let qrJson = {
        id: 1,
        randomNum: randomNum +'' + subjectCode,
        attendanceTime: attendanceTime,
        perceptionTime: perceptionTime
    }

    res.json(qrJson)
})// test QR


// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
// express 자체의 RestFul방식을 적용 가능 한지 찾아봐야함

// Part. Professor

// 1. 교수 메인창
// app.get('/desk/professor/main', (req, res) => {
//      // get parameter로 받는 형식으로 변경

//     connection.query(`
//     select cl.id as id, cl.name as name, p.name as professor, cl.code as code, cl.day, cl.startTime, cl.endTime, cl.color, cl.design
//     from professor as p
//     left join classList as cl on cl.professor_id = p.id
//     where p.id = 1
//     `, function(err, results, fields){
//         if(err) throw err

//         res.json(results)
//     })
// })

// 2. 교수 수업 생성 실행
// app.post('/desk/professor/classList', (req, res) => {
//     let body = req.body;

//     let inputName = body.InputClassName;
//     let inputCode = body.InputClassCode;
//     let inputDay = body.InputClassDay;
//     let inputStartTime = body.InputClassStartTime;
//     let inputEndTime = body.InputClassEndTime;
//     let inputColor = body.inputClassColor;
//     let inputDesign = body.InputClassDesign;
//     let inputPrfessorId = 1; // 임시. 이승진

//     let arr = [
//         inputName,  //1
//         inputCode,//2
//         inputDay, 
//         inputStartTime,
//         inputEndTime,
//         inputDesign,
//         inputColor,
//         inputPrfessorId//7
//     ];

//     connection.query(`
//         INSERT INTO classList (name, code, day, startTime, endTime, design, color, professor_id) 
//         VALUES (?, ?, ?, ?, ?, ?, ?);
//     `, arr, (err, results, fields) => {
//         if (err){
//             console.error(err);
//             throw err;
//         } 
//         console.log(inputName + "수업 생성 완료");
//         res.redirect('/desk/professor/main');
//     })
// })

// 3. 교수 수업 수정,    _ 오직 startTime, endTime, color, design만 변경가능
app.post('/desk/professor/classList/update', (req, res) => {
    let classListID = req.body.classListId;
    let startTime = req.body.edit_startTime;
    let endTime = req.body.edit_endTime;
    let color = req.body.edit_color;
    let design = req.body.edit_design;

    connection.query(`
        update classList 
        set startTime = ?, endTime = ?, color = ?, design = ?
        where (id = ?)
    `, [startTime, endTime, color, design, classListID], function(err, result) {
        if(err){
            console.error(err);
            throw err;
        }

        console.log(classListID + "번 수업 수정 완료.");
        res.redirect('/desk/professor/main');
    })
})

// 4. 교수 수업 삭제
app.post('/desk/professor/classList/delete', (req, res) => {
    // let classListID = req.body.classListId;    
    let classListID = req.body.classListID; // 임의로 보낸 값

    
    connection.query(`
        delete from classList
        where id = ?
    `, [classListID], (err, results) => {
        if(err) throw err

        console.log(classListID + "번 수업 삭제 완료.");
        res.redirect('/desk/professor/main');
    })
})  //localtest Success!

let _attendanceTime; // 출석시간
// 5. 교수 수업 qr코드 생성
app.post('/desk/professor/classList/qr/open', (req, res) => {
    let classListID = req.body.classListId;
    _attendanceTime  =  req.body.classHour; 
    console.log('_attendanceTime : ' + _attendanceTime);
    

    connection.query(`
        update classList
        set isOpened = ?
        where id = ?
    `, [true, classListID], function(err, result) {
        if(err){
            console.error(err);
            throw err;            
        }

        console.log("수업 opened 완료");
        console.log("이 수업의id = " + classListID);
        res.send('');
    })
})

// 6. 1초 마다 들어오는 qr 요청
app.post('/desk/professor/classList/qr/request', (req, res) => {
    let classListID = req.body.classListId;

    // 먼저 해당 과목의 isOpened가 true인지 확인한다.
    connection.query(`
        select isOpened, code 
        from classList
        where id  = ?
    `,  [classListID], function(err, result){
        if(err) throw err;

        
        if(result[0].isOpened == 1){

            let attendanceTime = new Date().getTime();
            let perceptionTime = attendanceTime + (5*60*1000);

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
app.post('/desk/professor/classList/attendance', (req, res) => {
    let professor_id = req.body.professor_ID;
    let class_id = req.body.classListID;

    connection.query(`
        select * from attendance as att 
        left join classList as cl on att.class_id = cl.id
        where cl.professor_id = ? and cl.id = ?;
    `, [class_id, professor_id], (err, result) => {
        if(err){
            console.error(err);
            throw err;
        }

        res.json(result);
    })
})

// 8. 교수가 수동으로 출석 변경
app.post('/desk/professor/classList/attendance/modify', (req, res) => {
    let attendance_id = req.body.attendance_ID;
    let edit_record = req.body.edit_record;
    let edit_reason = req.body.edit_reason;

    // 변경은 recored와 reason을 변경한다.
    // 특정 날짜를 알 수 있어야 한다. 아니 attendanceID만 알고 있으면 변경할 수 있다 어차피 이 url에 접근할 수 있는 유저는 해당 교수밖에 없으므로.    
    connection.query(`
        UPDATE attendance 
        SET record = ?, reason = ? 
        WHERE id = ?
    `, [attendance_id, edit_record, edit_reason], (err, result)=> {
        if(err){
            console.error(err);
            throw err;
        }

        res.redirect('/desk/professor/main');
    })
})

// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------


// Part. Student

// 1. 학생 메인 화면
app.get('/mobile/student/main', (req ,res) => {
    // 학생이 등록한 수업 목록이 보여줘야 된다.
    // 학생이 등록한 수업 목록을 보도록하자.
    let studentId = req.query.id;

    connection.query(`
    select class_id, cl.* from student as st 
    left join Student_has_class as ac on st.id = ac.student_id
    left join classList as cl on ac.class_id = cl.id
    where st.id = ?
    `, [studentId], function(err, result) {
        if(err) throw err;
        
        console.log("student main조회 성공");
        res.json(result);
    })
})// 성공

// 2. 학생 수업 등록
// 해당 class id와 studentId를 보내주어서 
// student has class 텡블을 변경한다.
app.post('/mobile/student/class', (req, res) => {
    let studentId = req.body.studentId;
    let classListId = req.body.classListId;

    connection.query(`
    INSERT INTO Student_has_class (student_id, class_id) 
    VALUES (?, ?);
    `, [studentId, classListId], function(err, result) {
        if(err) throw err;

        console.log("학생 : " + studentId + ", 수업 : " + classListId+ " 등록 성공");
        res.redirect('/mobile/student/main?id=' + studentId);
    })
}) // 성공


// 3. 학생 수업 삭제
// 단순히 방금 has테이블에서 연결고리를 끊으면 된다. 아니 행을 삭제하면 된다.
// 마찬가지로 학생의 아이디와 수업의 아이디가 요구된다.
app.post('/mobile/student/class/delete', (req, res) => {
    let studentId = req.body.studentId;
    let classListId = req.body.classListId;

    connection.query(`
    DELETE FROM Student_has_class 
    WHERE (student_id = ?) and (class_id = ?);
    `, [studentId, classListId], function(err, result) {
        if(err) throw err;

        console.log(studentId+'이 학생의 '+ classListId+"의 수업은 삭제되었습니다.")
        res.redirect('/mobile/student/main?id=' + studentId);
    })
})  // 성공


// 4. 학생 qr코드 인증 req
app.post('/mobile/qr/verify', (req, res) => {
    let qrNum = req.body.qrNum;
    let allowTime = req.body.allowTime;// 현재는 계속 작은 값을 보내줘 출석으로 되는데 테스트 할 때 실제 시간값을 보내줘서 체크할 수 있도록 한다.
    let studentID = req.body.studentId;
    let classStartTimeHour = req.body.classStartTime; 
    
    console.log("qr인증 test");

    // qrNum의 뒤에 3자리(수업 코드는 따로 떼어낸다.)
    qrNum = qrNum+"";
    let onlyRandomNum = qrNum.substring(0, qrNum.length - 3);
    let classCode = qrNum.substring(qrNum.length - 3, qrNum.length);


    // 현재 db의 classList의 상태 역시 확인한다.
    connection.query(`
        select isOpened, startTime, id from classList
        where code = ?
    `, [classCode], function(err, result){
        if(err) throw err;


        // db에서 해당 클래스의 출석 인정 시간을 가져오자
        // let classStartTimeHour = (result[0].startTime*1) / 60; //시간 값으로 바꿈 ex) 10 => 오전 10시, 아마 getHour()했을 때도 비슷하지 않았나..
        // classStartTimeHour = classStartTimeHour-9;  // 시간 차이 미국 시간으로 들어오나 봄   
        
               
        let classStartTimeMinute = (classStartTimeHour*1) % 60; // 나머지를 구함으로써 분(minute)을 구한다.

        console.log("classStartTimeHour: "+classStartTimeHour);
        console.log("classStartTimeMinute: " +classStartTimeMinute);

        // 변수에 classList의 상태를 저장한다.
        let classIsOpened = result[0].isOpened;

        let isAllow = checkRandomArray(onlyRandomNum, allowTime, classStartTimeHour, classStartTimeMinute);

        // class의 상태와 시간 값, 난수 값 모두 일치한다면 
        if(isAllow == 2 && classIsOpened){
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


})  //실제로 테스트 해 봐야하는 ** 가장 중요

// 5. 학생 출석 현황 보기
app.post('/mobile/student/class/attendance', (req, res) => {
    let student_id =req.body.studentID;
    let class_id = req.body.classListID;

    // 해당 학생의 해당 과목의 출석 결과를 보여준다.
    connection.query(`
    select * from attendance
    where student_id = ? and class_id = ?;
    `, [student_id, class_id], (err, result) => {
        if(err){
            console.error(err);
            throw err;
        }
        
        res.json(result);
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


