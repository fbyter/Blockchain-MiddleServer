'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const request = require('../models/request');

/* get user message from db and check password */
async function pay(body) {
  const payer = body.payer;
  const owner = body.owner;
  const password = body.password;
  const flag =  body.flag;
  let name = '';

  if(flag === 1)
    name = payer;
  else //coin
    name = owner;

  let status = 'error', msg = '---origin message---', key = '', users = [];

  if(!payer || !owner)
    msg = 'empty name!';
  else if(!password)
    msg = 'empty password';
  else {
    status = 'failed';

    await db.getUserMsg(name).then(async (dbResult) => {
      if(dbResult.password === password) {
        let key = '';
        if(flag === 1)
          key = dbResult.key;
        else
          key = "MEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCCR+1+S2rEAgMZ5ac4I+tAT6TyhPljhuPoHzFV90XZLXg==";

        let args = {
          payer: payer,
          owner: owner,
          flag: flag,
          amount: body.amount,
          key: key
        };
        let res = await request.post('pay', args).then(result => {
          status = result.code;
          msg = result.data
        })
      }
      else
        msg = 'wrong password'
    });

  }

  const result = {
    status: status,
    msg: msg
  };
  return new Promise((resolve,reject) => resolve(result))
}

/* GET login msg. */
router.post('/', function(req, res, next) {
  pay(req.body).then( result => {
    res.json(result)
  });
});

module.exports = router;
