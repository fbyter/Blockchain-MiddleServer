'use strict';
const express = require('express');
const router = express.Router();

/* GET register msg. */
router.get('/', function(req, res, next) {
  res.render('sign_up', { url: 'http://222.20.105.151:4396' });
  /*register.registerUser(req.body).then( result => {
    res.render('sign_up', result)
  })*/

});

module.exports = router;
