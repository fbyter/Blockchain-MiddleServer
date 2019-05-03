var express = require('express');
var router = express.Router();
//var bodyParser = require('body-Parser')
var fabric = require('../models/fabric');
var db = require('../models/db');

//check password is illegal
var checkPasswd = (password = '') => {
  let regExist = /(?=.*\d)(?=.*[a-z])(?=.*[`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|])/i;
  let regNum = /^[0-9a-z`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|]{6,12}$/i;
  let regIllegal = /^[^0-9a-z`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|]$/i;
  //let regIllegal = /(?!.*[^0-9a-z`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|])/i;

  let flag = false;
  //empty?
  if(typeof password == 'string') {
    if(regExist.test(password) && regNum.test(password) && !regIllegal.test(password))
      flag = true
  }
  return flag
};

//register a user from fabric
//if name is null, transform to ''
var registerUser = (name='', password='', callback) => {
  let status = '', msg = '', key = '';
  if(name === '') {
    status = 'error';
    msg = 'illegal name!'
  } else if(!checkPasswd(password)) {
    status = 'error';
    msg = 'illegal password!'
  }
  else {
    key = fabric.register(name, password);
    status = 'success';
    msg = `${status} register user ${name}`
  }
  callback && callback({
    status: status,
    msg: msg,
    key: key
  });
};

//add message to db
/*
var sql = 'insert  '
var arr = msg
db.query()
*/

/* GET home page. */
router.post('/', function(req, res, next) {
  let name = req.body.name;
  let password = req.body.password;
  //res.render('index', { title: 'Express' });
  registerUser(name, password, result => {
    res.json(result)
  });

  //res.end('yes')
});

module.exports = router;
