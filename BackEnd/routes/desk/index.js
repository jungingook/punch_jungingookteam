const express = require('express');
const router = express.Router();

// //mysql 
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'qr.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'dlwhdgh009',
    port: '3306',
    database: 'qrqr'
})
connection.connect()


router.get('/testRouter', (req, res) => {
    res.send('good Test Well!');
})

// 1. 교수 메인창
router.get('/professor/main', (req, res) => {
     // get parameter로 받는 형식으로 변경

     connection.query(`
     select cl.id as id, cl.name as name, p.name as professor, cl.code as code, cl.day, cl.startTime, cl.endTime, cl.color, cl.design
     from professor as p
     left join classList as cl on cl.professor_id = p.id
     where p.id = 1
     `, function(err, results, fields){
         if(err) throw err
 
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



module.exports = router;