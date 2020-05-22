const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const app = express();

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

/** use */
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret', // 세션을 암호화 해줌
    resave: false, // 세션을 항상 저장할지 여부를 정하는 값. (false 권장)
    saveUninitialized: true,// 초기화되지 않은채 스토어에 저장되는 세션
    store: new MySQLStore({ // 데이터를 저장되는 형식
        host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
        user:'admin',
        password: 'dlwhdgh009',
        port: '3306',
        database: 'qrqr'
    })
}))


// 1. 교수 메인창
router.get('/professor/main', (req, res) => {

     connection.query(`
     select cl.id as id, cl.name as name, p.name as professor, cl.code as code, cl.day, cl.startTime, cl.endTime, cl.color, cl.design
     from professor as p
     left join classList as cl on cl.professor_id = p.id
     where p.id = 1
     `, function(err, results, fields){
        if(err) throw err


        console.log("session.logId = " + req.session.logId);        

        res.json(results)
     })
 })

// 2. 교수 수업 생성 실행
router.post('/professor/classList', (req, res) => {
    let body = req.body;

    let inputName = body.InputClassName;
    let inputCode = body.InputClassCode;
    let inputDay = body.InputClassDay;
    let inputStartTime = body.InputClassStartTime;
    let inputEndTime = body.InputClassEndTime;
    let inputColor = body.inputClassColor;
    let inputDesign = body.InputClassDesign;
    let inputPrfessorId = 1; // 임시. 이승진

    let arr = [
        inputName,  //1
        inputCode,//2
        inputDay, 
        inputStartTime,
        inputEndTime,
        inputDesign,
        inputColor,
        inputPrfessorId//7
    ];

    connection.query(`
        INSERT INTO classList (name, code, day, startTime, endTime, design, color, professor_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, arr, (err, results, fields) => {
        if (err){
            console.error(err);
            throw err;
        } 
        console.log(inputName + "수업 생성 완료");
        res.redirect('/desk/professor/main');
    })
})

// 3. 교수 수업 수정,    _ 오직 startTime, endTime, color, design만 변경가능
// app.post('/desk/professor/classList/update', (req, res) => {

// 4. 교수 수업 삭제
// app.post('/desk/prfoessor/classList/delete', (req, res) => {

// let _attendanceTime; // 출석시간
// 5. 교수 수업 qr코드 생성
// app.post('/desk/professor/classList/qr/open', (req, res) => {

// 6. 1초 마다 들어오는 qr 요청
// app.post('/desk/professor/classList/qr/request', (req, res) => {

// 7. 교수가 자신의 과목에 대한 모든 출결현황 보기
// app.post('/desk/professor/classList/attendance', (req, res) => {

// 8. 교수가 수동으로 출석 변경
// app.post('/desk/professor/classList/attendance/modify', (req, res) => {


// 9. sign_up 회원가입 페이지
router.post('/professor/sign_up', (req, res)=>{
    let logId = req.body.inputId;
    let password = req.body.inputPw;
    let name = req.body.inputName;
    let email = req.body.inputEmail;

    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    console.log("salt = "  +salt);
    let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");
    console.log("hasPs = " + hashPassword);

    connection.query(`
        INSERT INTO professor (name, email, login_id, login_pw, salt) 
        VALUES ( ?, ?, ?, ?, ?);
    `, [name, email, logId, hashPassword, salt], function(err, result) {
        if(err){
            console.error(err);
            throw err;
        }

        console.log(" 교수 회원 가입 완료");
        res.redirect('/desk/professor/main');
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

       let dbPassword = result[0].login_pw;
       let salt = result[0].salt;       
       let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

       if(hashPassword === dbPassword){
           console.log("비밀번호 일치");

            // session 설정
            req.session.logId = logId;
            console.log("session_id = " )
            console.log(req.session);
            req.session.save( () => {
                res.json(req.session);
                // res.redirect('/desk/professor/main');
            })
       }else{
            console.log("비밀번호 불일치")
            res.redirect("/desk/professor/login");
       }
   })
})

// 11. 로그인 화면 GET
router.get('/professor/login', (req, res) => {
    res.send("로그인 GET화면!!!!!")
})

module.exports = router;