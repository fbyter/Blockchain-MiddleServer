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
      if(dbResult.password === password) {
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
  //res.render('index', { title: 'Express' });
  loginUser(req.body).then( result => {
    res.json(result)
  });
});

module.exports = router;
