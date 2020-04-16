const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port  = 3000;

// //mysql 
// var mysql = require('mysql')
// var connection = mysql.createConnection({
//     host: '',
//     user: '',
//     password: '',
//     port: '',
//     database: ''
// })
// connection.connect()

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

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//router
app.get('/index', function(req, res){
    res.end('hello')
})

app.get('/desk/main', (req, res) => {
    `
    <!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <title>Desk-Main</title>
    </head>
    <body>
        <h1>Main</h1>
        <hr>
    
        <form action="/desk/subject" method="post">
            <input type="submit" value="수업 생성">
        </form>
    
        <form action="/desk/qr" method="POST">
            <table>
                <tr>
                    <th>수업 이름</th>
                    <th><input type="submit" value="QR코드 생성"></th>
                    <th><a href="/desk/absent">출석 변경</a></th>
                </tr>            
            </table>
        </form>
        
    </body>
    </html>
    `
})

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
})

app.listen(port, function(){
    console.log(`app2 is listening on port: ${port}`)
})