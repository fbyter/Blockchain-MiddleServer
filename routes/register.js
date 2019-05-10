'use strict';
const express = require('express');
const router = express.Router();
const fabric = require('../models/fabric');
const db = require('../models/db');
//var bodyParser = require('body-Parser')

const dbOpt = fabric.dbOpt;

//check password is illegal
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

//register a user from fabric-process
//if name is null, transform to ''
const registerUser = async (body) => {
  const name = body.name;
  //console.log(name.toString());
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
      await fabric.register(name).then( async key => {
        //mysql保存用户name, password, email, privateKey;
        let sqlArgs = [name, password, key, 'fbyter@qq.com'];
        await db.insertOne(sqlArgs).then(flag => {
          //这个print可以判定await的作用
          //console.log(flag);
          if(flag) {
            status = 'success';
            msg = `${status} to create user ${name}`;
          } else
            msg = `${status} to add user ${name} to DB`
        })
      }, store => {
        msg = `${status} to storePubKey for ${name}`;
        console.log('failed to store public key', store)
      }).catch(err => {
        msg = 'fabric-register function bug!';
        console.log(msg, err);
      });

    } else {
      //phone user
      //let privateKey7 = isPhone;
      let sqlArgs = [name, password, isPhone, 'fbyter@qq.com'];
      db.insertOne(sqlArgs).then(sqlResult => {
        msg = `${status} to create user ${name}`
      });
      //默认mysql操作没有问题, 不catch error
    }
  }

  return new Promise((resolve,reject) => resolve({ status: status, msg: msg }))

  //callback && callback({status: status, msg: msg});
};

/* GET home page. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  registerUser(req.body).then( result => {
    res.json(result)
  })

});

module.exports = router;
