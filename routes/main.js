'use strict';
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const fabric = require('../models/fabric.js');

/* GET register msg. */
router.get('/', function(req, res, next) {
  const params = req.query;
  const name = params.name;
  db.getUserMsg(name).then(async dbResult => {
    let key = 'clearlove7';
    /*const key = await fabric.getPubKey(name).then(result => {
      return result.key;
    });*/
    const users = await db.getAllUsers();

    let userx = [];

    for(let x of users) {
      if(x["name"] !== name && x["name"] !== 'admin')
        userx.push(x["name"])
    }
    console.log(userx);
    res.render('main', {name: name, users: userx, key: key})
  });

});

module.exports = router;
