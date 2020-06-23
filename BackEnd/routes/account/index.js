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


        if (!result || result == [] || result == null) {    // 잘못된 id로 접근할 경우 해야할 이벤트
            console.log("잘못됭 id로 접근")
            res.json({
                error: true,
                message: "잘못된 id로 접근"
            })
            return;
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

router.post('/student/sign_up', (req, res) => {
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
        if (err) {
            console.error(err);
            throw err;
        }
        console.log("student = ");
        console.log(student);

        if (student[0]) {
            console.log("동일한 아이디를 가진 유저가 존재합니다.");
            res.json({
                message: "동일한 아이디를 가진 유저가 존재합니다.",
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
            if (err1) {
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

router.post('/student/login', (req, res) => {
    let {
        inputId,
        inputPw,
        inputMobileId
    } = req.body;

    connection.query(`
        select login_pw, salt, mobile_no, id
        from student
        where login_id = ?
    `, [inputId], (err, student) => {
        if (err) {
            console.error(err);
            throw err;
        }

        if (!student || student == [] || student == null) {
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

        if (hashPassowrd === dbPassword) {
            console.log('비밀번호 일치');

            let mobile_no = student[0].mobile_no;
            console.log("mobile_no: ", mobile_no);

            if (!mobile_no) {
                console.log("SUCCESS: 현재 학생의 모바일 id가 없음으로 등록을 진행합니다.")
                connection.query(`
                    update student set mobile_no = ?
                    where login_id = ?
                `, [inputMobileId, inputId], (err2, result2) => {
                    if (err2) {
                        console.error(err2);
                        throw err2;
                    }

                    console.log(`SUCCESS: 학생의 모바일 id를 ${inputMobileId}로 등록하였습니다.`);
                    res.json({
                        error: false,
                        token: makeToken(inputId)
                    });

                })
            } else if (inputMobileId == mobile_no) {
                console.log("SUCCESS: 모바일 id가 동일합니다.");

                res.json({
                    error: false,
                    token: makeToken(inputId)
                });
            } else if (inputMobileId != mobile_no) {
                console.log("Warning: 현재 등록된 모바일 id와 다른 id가 들어왔습니다.")
                // 갱신 mobile_id
                connection.query(`
                    update student set mobile_no = ?, mobile_change_time = ?
                    where login_id = ?
                `, [inputMobileId, new Date().getTime(), inputId], (err2, result2) => {
                    isError(err);

                    console.log(`SUCCESS: 학생의 모바일 id를 ${inputMobileId}로 등록하였습니다.`);                    
                })
            }
        } else {
            console.log("비밀번호 불일치")

            res.json({
                error: true,
                message: '비밀번호 불일치',
                token: makeToken(inputId)
            });
        }
    })
})

router.post('/professor/password', (req, res) => {
    let token = req.headers['x-access-token'] || req.query.token;
    let input_password = req.body.inputPw;

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
        let login_id = decoded.logId;
        console.log("login_id: ", login_id);

        connection.query(`
            select login_pw, salt
            from professor
            where login_id = ?
        `, [login_id], (err1, professor) => {
            isError(err1);

            if(isEmpty(professor)){
                console.log("Warning: 현재 등록되지 않은 계정입니다.");
                res.json({
                    message: "등록되지 않은 계정입니다.",
                    error: true
                })
                return;
            }
            let db_password = professor[0].login_pw;
            let db_salt = professor[0].salt;

            let hashPassowrd = crypto.createHash("sha512").update(input_password + db_salt).digest("hex");

            if(hashPassowrd == db_password) {
                res.json({
                    message: "SUCCESS: 비밀번호 일치",
                    error: false
                })
                return;
            }else {
                res.json({
                    message: "Warning: 비밀번호 불일치",
                    error: true
                })
            }
        })
    })
})

function makeToken(logId) {
    let token = jwt.sign(
        { logId },
        secretObj.secret,
        { expiresIn: '10h' }
    )
    return token;
}

function isError(err) {
    if (err) {
        console.error(err);
        throw err;
    }
}



function isEmpty(user) {
    if(!user || user.length == 0) {
        return true;
    }
    return false;
}


module.exports = router;