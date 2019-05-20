'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models/db');

/* get user message from db and check password */
async function loginUser(body) {
  const name = body.name;
  const password = body.password;

  let status = 'error', msg = '---origin message---', key = '', users = [];

  if(!name)
    msg = 'empty name!';
  else if(!password)
    msg = 'empty password';
  else {
    status = 'failed';

    await db.getUserMsg(name).then(async dbResult => {
      if(!dbResult)
        msg = `user ${name} is not exist!`;
      else if(dbResult.password === password) {
        status = 'success';
        msg = 'login success';
        key = dbResult.key;
        users = await db.getAllUsers()
      }
      else
        msg = 'wrong password'
    })
  }

  const result = {
    status: status,
    msg: msg,
    key: key,
    users: users
  };
  return new Promise((resolve,reject) => resolve(result))
}

/* GET login msg. */
router.post('/', function(req, res, next) {
  if((!req.body.name) && (!req.body.password)) res.redirect('https://www.google.com');
  else loginUser(req.body).then( result => {
    if(result.status === 'success') {
      //登录成功, 设置cookie
      let expiryTime = new Date( Date.now() + 10 * 60 * 1000 );
      let cookieParam = {
        domain: 'www.fabricwallet.com',
        session: true,
        httpOnly: true,
        maxAge: 600*1000,
        path: '/wallet'
      };
      //res.cookie("username", req.body.name, cookieParam)
    }
    res.json(result)
  });
});

module.exports = router;
