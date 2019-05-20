'use strict';
const express = require('express');
const router = express.Router();
const fabric = require('../models/fabric');
const db = require('../models/db');
//var bodyParser = require('body-Parser')

/* check password is or not illegal */
const checkPasswd = (password = '') => {
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

/* register a user from fabric-process and db */
async function registerUser(body) {
  //console.log(body);
  const name = body.name;
  const password = body.password;
  const email = body.email;
  const isPhone = body.key ? body.key : '';

  let status = 'error', msg = '---origin message---';

  if(!name)
    msg = 'illegal name!';
  else if(!checkPasswd(password))
    msg = 'illegal password!';

  else {
    status = 'failed';

    let isExist = await db.isExist(name);
    //isExist = true;
    //console.log(isExist);

    if(isExist) {
      msg = `user ${name} has been registered!`
    }
    else if(!isPhone) {
      await fabric.register(name).then( async (response) => {
        //mysql保存用户name, password, email, privateKey;
        let key = response.key;
        let sqlArgs = [name, password, key, email];
        await db.insertOne(sqlArgs).then(sqlResult => {
          //这个print可以判定await的作用
          //console.log(sqlResult);
          if(sqlResult) {
            status = 'success';
            msg = `${status} to create user ${name}`;
          } else
            msg = `${status} to add user ${name} to DB`
        })
      }, error => {
        msg = `${status} to storePubKey for ${name}`;
        console.log('routes/register: ', error.msg)

      }).catch(err => {
        msg = 'register db function bug!';
        console.log(msg, ': ',err);
      });

    } else {
      //phone user
      let sqlArgs = [name, password, isPhone, email];
      await db.insertOne(sqlArgs).then(sqlResult => {
        if(sqlResult) {
          status = 'success';
          msg = `${status} to create user ${name}`;
        } else
          msg = `${status} to add user ${name} to DB`
      });
      //默认mysql操作没有问题, 不catch error
    }
  }

  return new Promise((resolve,reject) => resolve({ status: status, msg: msg }))
  //callback && callback({status: status, msg: msg});
}

/* GET register msg. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  registerUser(req.body).then( result => {
    res.json(result)
  })

});

module.exports = router;
