const express = require('express');
const router = express.Router();
const fabric = require('../models/fabric');
const request = require('../models/request');

/* GET to test fabric-process api. */
router.get('/', async function (req, res, next) {
  const params = req.query;
  const keys = Object.keys(params);
  //console.log(params);

  if (keys.includes('api') && keys.includes('name')) {
    //get 请求参数是string
    const name = params['name'];
    let result = {clearlove:"7"};
    switch (params['api']) {
      case '1':
        fabric.register(name);
        break;
      case '2':
        fabric.getPubKey(name);
        break;
      case '3':
        result = await request.post('balance', {name: name});
        break;
      case '4':
        fabric.post('balance', {name: name});
        break;
      default:
        break;
    }
    res.send(result)
  } else {
    res.send({clearlove: 'must have api(number) and name(string)'})
  }
});

module.exports = router;
