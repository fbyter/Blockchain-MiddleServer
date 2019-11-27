'use strict';
const fly = require('flyio');
const fabricConf = require('./conf/fabric');

const url = fabricConf.Tongz.javaUrl;
//console.log(url);

async function post(func, args) {
  let data = null;
  //console.log(func,args);
  switch (func) {
    case 'register': case 'balance': case 'pubkey':
      data = {
        func: func,
        name: args.name
      };
      break;
    case 'pay':
      data = args;
      data.func = func;
      break;
    default:
      data = {};
      break;
  }

  return await fly.post(url, data)
    .then(function (response) {
      //fly 框架的response被包裹在data中
      console.log(response.data);
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });
}

function get(func, args) {
  let data = null;
  let url7 = null;
  const blockUrl = fabricConf.Tongz.blockUrl;

  //console.log(func,args);
  switch (func) {
    case 'blockAndTxList':
      url7 = (blockUrl + '/0?from=Sun%20May%2012%202019%2012:23:51%20GMT+0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&&to=Sun%20Jun%2030%202019%2012:23:51%20GMT+0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)')
              .replace(/function/, func);
      break;
    case 'transaction':
      url7 = (blockUrl +'/'+args).replace(/function/, func);
      break;
    default:
      return {'error':'error api'};
      //break;
  }

  return fly.get(url7)
    .then(function (response) {
      //fly 框架的response被包裹在data中
      //console.log(response.data.rows[0]);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.post = post;
exports.get = get;
