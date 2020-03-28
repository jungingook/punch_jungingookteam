var express = require('express');
const models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/board', function(req, res, next) {
  res.render('show');
});

router.post('/board', function(req, res, next){
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
  .then( result => {
    console.log("데이터 추가 완료");
    res.redirect("/board");
  })
  .catch( err=> {
    console.log("데이터 추가 실패");
  })
});

module.exports = router;
