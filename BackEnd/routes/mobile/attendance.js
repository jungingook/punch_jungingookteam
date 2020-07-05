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

// 5. 학생 출석 현황 보기
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

        connection.query(`
            select * 
            from student 
            where student.login_id = ?;
        `, [decoded.logId], (err2, student) => {
            if (err2) throw err2;

            let student_id = student[0].id;
            let class_id = req.query.classListID;
            console.log("프론트가 보내줘야하는 값: classListID: ", class_id);


            // 해당 학생의 해당 과목의 출석 결과를 보여준다.
            connection.query(`
                select cl.name, att.week_id, att.id as attendance_id ,att.record,
                    att.reason, att.created_day, att.updated_day,
                    att.is_fingerprint, att.is_gtx, att.is_passive, att.is_qr 
                from attendance as att                
                left join classList as cl on cl.id = att.class_id
                where att.student_id = ? and att.class_id = ?
            `, [student_id, class_id], (err, result) => {
                if (err) {
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

                    if (student1.record == '출석') {
                        attend_count++;
                    } else if (student1.record == '지각') {
                        late_count++;
                    } else if (student1.record == '결석') {
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
module.exports = router;


function getDate(date) {
    let year = date.getUTCFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let result = (year + "-" + month + "-" + day)

    return result;
}