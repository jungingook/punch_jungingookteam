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

// 3-1. 교수 회차 삭제
router.delete('/', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    let {
        class_id,
        week,
    } = req.body;
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
        let logId = decoded.logId;


        console.log("class_id: ", class_id);
        console.log("week: ", week);

        connection.query(`
            select week from classList
            where id = ?
        `, [class_id], (err0, class_week) => {
            isError(err0);


            connection.query(`
                    DELETE FROM week 
                    WHERE class_id = ? and week = ?;
                `, [class_id, week], (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }

                connection.query(`
                        delete from attendance
                        where class_id = ? and week_id = ?
                    `, [class_id, week], (err2, result2) => {
                    if (err2) {
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

                        if (err3) {
                            console.error(err3);
                            throw err3;
                        }

                        console.log("해당 수업의 시작시간을 0으로 초기화했습니다.")
                        console.log("해당 수업의 회차를 1 감소시켰습니다.", week - 1)
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
})

module.exports = router;

function isError(err) {
    if (err) {
        console.error(err);
        throw err;
    }
}