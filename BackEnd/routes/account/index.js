const express = require('express');
const router = express.Router();
const crypto = require('crypto');
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

// 1-1. sign_up 회원가입 페이지
router.post('/professor/sign_up', (req, res) => {
    let logId = req.body.inputId;
    let password = req.body.inputPw;
    let name = req.body.inputName;
    let email = req.body.inputEmail;

    connection.query(`
        select login_id, email 
        from professor
        where login_id = ?
    `, [logId], (err, result1) => {
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(result1);
        if (result1.length != 0) {
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
        `, [name, email, logId, hashPassword, salt, new Date()], function (err, result) {
            if (err) {
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
   `, [logId], function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }


        if (!result || result === [] || result === null) {    // 잘못된 id로 접근할 경우 해야할 이벤트
            res.redirect('/professor/main');
            return false;
        } else {
            let dbPassword = result[0].login_pw;
            let salt = result[0].salt;
            let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

            if (hashPassword === dbPassword) {
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
            } else {
                console.log("비밀번호 불일치")
                //jwt 생성 후 전송
                let token = jwt.sign(
                    { logId },
                    secretObj.secret,
                    { expiresIn: '10h' }
                )


                res.json({
                    error: true,
                    message: '비밀번호 불일치',
                    token
                });
            }
        }


    })
})


module.exports = router;