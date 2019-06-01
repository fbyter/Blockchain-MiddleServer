'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const fabric = require('../models/fabric.js');
const request = require('../models/request');

/* GET register msg. */
router.get('/', function(req, res, next) {
  const params = req.query;
  let name = params.name;
  const session = req.session;
  if(session.login === true && session.username === name) {
    db.getUserMsg(name).then(async dbResult => {
      let key = 'clearlove7';
      /*const key = await fabric.getPubKey(name).then(result => {
        return result.key;
      });*/

      /* get all users */
      const users = await db.getAllUsers();
      let userx = [];
      for (let x of users) {
        if (x["name"] !== name && x["name"] !== 'admin')
        //if(x["name"] !== name)
          userx.push(x["name"])
      }
      //console.log(userx);
      res.render('main', {name: name, users: userx, key: key})
    });
  } else {
    if(!name) name = '';
    res.redirect(`http://222.20.105.151:4396/signin?name=${name}`)
  }

});

module.exports = router;
