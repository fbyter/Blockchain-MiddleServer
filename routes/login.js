'use strict'
const express = require('express');
const router = express.Router();
const db = require('../models/db');

//register a user from fabric-process
//if name is null, transform to ''
function checkUser(name='', password='', callback) {
  let status = 'error', msg = '', key = '';
  db.query("", "", (result, fields) => {
    if(result === "") {
      msg = `user ${name} is not exist!`
    }
    else if(result !== password) {
      msg = `user ${name}'s password error!`
    } else {
      status = "success";
      msg = `${status} register user ${name}`
      key = '';
      //users = db.query("", "", "");
    }
  });
  callback && callback({
    status: status,
    msg: msg,
    key: key
  });
}

/* GET home page. */
router.post('/', function(req, res, next) {
  let name = req.body.name;
  let password = req.body.password;
  //res.render('index', { title: 'Express' });
  registerUser(req.body).then( result => {
    res.json(result)
  })
  checkUser(name, password, result => {
    res.json(result)
  });

  //res.end('yes')
});

module.exports = router;
