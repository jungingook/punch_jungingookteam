const express = require('express');
const bodyParser = require('body-parser');

const methodOverride = require('method-override')

const app = express();
const port  = 3000;


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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))


//router

app.get('/desk/qr', (req, res) => {
    const min = Math.ceil(1000000000);  //10억 10자리
    const max = Math.floor(10000000000);    //100억 11자리
    const randomNum =  Math.floor(Math.random() * (max - min)) + min;   //10자리의 랜덤 값
    const time = new Date();
    const currentTime = time.getTime(); //밀리초 단위로 환산

    const fiveM = 5 * 60 * 1000;
    const attendanceTime = currentTime
    const perceptionTime = currentTime + fiveM



    const  subjectCode = 100;
    const qrJson = {
        id: 1,
        randomNum: randomNum +'' + subjectCode,
        attendanceTime: attendanceTime,
        perceptionTime: perceptionTime
    }

    res.json(qrJson)
})// test QR


// 교수 메인창
app.get('/desk/professor/main', (req, res) => {

    connection.query(`
    select p.id as professor_id, p.name as professor_name, cl.name as cl_name, cl.code as cl_code, cl.startTime as cl_startTime, cl.endTime as cl_endTime,cl.design as cl_design, cl.day as cl_day 
    from professor as p
    left join classList as cl on cl.professor_id = p.id
    where p.id = 1
    `, function(err, results, fields){
        if(err) throw err

        res.json(results)
    })
})

// 교수 수업 생성 페이지
app.get('/desk/professor/classList', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <h1>CREATE ClassList</h1>
            <hr>

            <form action="/desk/professor/classlist" method="POST">
                <table>
                    <tr>
                        <td><input type="text" name="InputClassName" placeholder="InputClassName"></td>
                        <td><input type="text" name="InputClassCode" placeholder="InputClassCode"></td>
                        <td><input type="text" name="InputClassDay" placeholder="InputClassDay"></td>
                        <td><input type="text" name="InputClassStartTime" placeholder="InputClassStartTime"></td>
                        <td><input type="text" name="InputClassEndTime" placeholder="InputClassEndTime"></td>
                        <td><input type="text" name="InputClassDesign" placeholder="InputClassDesign"></td>
                        
                    </tr>
                    
                </table>        
                <input type="submit" value="create new Class" />
                <button><a href="/desk/professor/classList/add"></a>Edit Button!!!!</button>
            </form>
        </body>
        </html>
    `)
})

// 교수 수업 생성 실행
app.post('/desk/professor/classList', (req, res) => {
    const professor_ID = 1
    const body = req.body

    const inputName = body.InputClassName
    const inputCode = body.InputClassCode
    const inputDay = body.InputClassDay
    const inputStartTime = body.InputClassStartTime
    const inputEndTime = body.InputClassEndTime
    const inputDesign = body.InputClassDesign
    const inputPrfessorId = 1 // 임시. 이승진

    const arr = [
        inputName,  //1
        inputCode,//2
        inputDay, 
        inputStartTime,
        inputEndTime,
        inputDesign,
        inputPrfessorId//7
    ]

    connection.query(`
        INSERT INTO classList (name, code, day, startTime, endTime, design, professor_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `, arr, (err, results, fields) => {
        if (err) throw err

        res.redirect('/desk/professor/main');
    })
})


// 교수 수업 수정 삭제 페이지
app.get('/desk/professor/classList/add', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <h1>수정하거나 삭제하거나 하는 페이지</h1>
            <hr>

            <form action="/desk/professor/classList?_method=PUT" method="POST">
                <table>
                    <tr>
                        <td><input type="text" name="editSomething" placeholder="editSomething"></td>
                        <td><input type="text" name="editSomething2" placeholder="editSomething2"></td>
                    </tr>
                </table>
                <input type="submit" value="editSomething">
            </form>
            <br>
            <br>



            <form action="/desk/professor/classList?_method=DELETE" method="POST">
                <input type="submit" value="deleteClassList">
            </form>
        </body>
        </html>
    `)
})

// 교수 수업 삭제
// 현재 잘 안먹힘 이유에 대해 생각해 봐야함
app.delete('/desk/prfoessor/classList', (req, res) => {
    const classListID = 5 // 임의로 보낸 값
    console.log(" delete 성공?")    // 안나옴
    connection.query(`
        delete from classList
        where id = ?
    `, [classListID], (err, results) => {
        if(err) throw err

        res.redirect('/desk/professor/main');
    })
})


// 교수 수업 qr코드 생성



//  listen

app.listen(port, function(){
    console.log(`app2 is listening on port: ${port}`)
})


// comment


// const cors = require('cors');

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

// app.use(cors());