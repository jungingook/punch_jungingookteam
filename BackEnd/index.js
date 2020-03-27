var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//데베 접속
var mysql      = require('mysql'); 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test123',
  port     : '3306',
  database : 'test_qr'
});
connection.connect();//연결 OK!


var path = require('path');

//AWS S3
// var multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
// let s3 = new AWS.S3();

// // 이미지 저장경로, 파일명 세팅
// const upload = multer({      
//       storage: multerS3({
//           s3: s3,
//           bucket: "storyline-image-bucket", // 버킷 이름
//           contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
//           acl: 'public-read-write', // 클라이언트에서 자유롭게 가용하기 위함
//           key: (req, file, cb) => {            
//             let extension = path.extname(file.originalname);
//             console.log('file : ' + file);
//             console.log('extension : ' + extension);
//             cb(null, Date.now().toString() + file.originalname)
//           },
//       }),
//       limits: { fileSize: 12 * 1024 * 1024 }, // 용량 제한 5MByte
// });



// connection.query('select * from student', function(err, rows, fields){
//     if(!err){
//         console.log('The solution is: ' + rows);
//     }
//     else{
//         console.log('Error while performing Query: ' + err);
//     }
// });

app.post('/main', function(req, res){
    //모든 student내용 json형태로 보내기
    var login_id = req.body.id;

    connection.query(`
        select * from student where login_id = ?
    `,[login_id],  function(err, result){
        if(err){
            console.log('Error! this is why : ' + err);
            throw err;
        }
        else{
            res.send('result');
        }
    });
});

app.get('/main', function(req, res) {
    connection.query('select * from student', function(err, results){
        if(err){
            console.log('ERROR!!!!!!!!!!!!' + err);
            throw err;
        }
        res.send(results);
    });
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
//connection.end();