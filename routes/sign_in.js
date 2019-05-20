'use strict';
const express = require('express');
const router = express.Router();

/* GET register msg. */
router.get('/', function(req, res, next) {
  const params = req.query;
  //const keys = Object.keys(params);
  res.render('sign_in', { name: params.name, password: params.password });
});

module.exports = router;
