const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
// const cookieParser = require('cookie-parser')


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(cors());
// app.use(cookieParser())


// Router 설정
const mobileRouter = require('./routes/mobile');
const accountRouter = require('./routes/account');
const classListRouter = require('./routes/desk/class');
const weekRouter = require('./routes/desk/week');
const attendanceRouter = require('./routes/desk/attendance');
const mobileAttendanceRouter = require('./routes/mobile/attendance');
const qrRouter = require('./routes/qr');

app.use('/account', accountRouter);

app.use('/desk/classList', classListRouter);
app.use('/desk/week', weekRouter);
app.use('/desk/classList/attendance', attendanceRouter);

app.use('/mobile', mobileRouter);
app.use('/mobile/attendance', mobileAttendanceRouter);

app.use('/qr', qrRouter);

//  listen

app.listen(port, function () {
    console.log(`app2 is listening on port: ${port}`)
})
