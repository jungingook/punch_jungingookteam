const express = require('express');
const router = express.Router();

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

// ~


// 6. send Message
router.post('/student/message', (req, res) => {
    let studentId = req.body.student_id;
    let professorId = req.body.professor_id;
    let ms_title = req.body.title;
    let ms_content = req.body.content;

    // db 저장하기 = create
    connection.query(`
    INSERT INTO message (title, content, student_id, professor_id) 
    VALUES (?, ?, ?, ?);
    `, [ms_title, ms_content, studentId, professorId], (err, result) => {
        if(err){
            console.error(err);
            throw err;
        }

        console.log("send message good");
        console.log("student: " + studentId + ", pro: " +professorId);

        res.redirect('/student/main');
    })

})

module.exports = router;