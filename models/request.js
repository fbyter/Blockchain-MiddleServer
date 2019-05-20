'use strict';
const fly = require('flyio');
const fabric_conf = require('./conf/fabric');

const url = 'http://'+fabric_conf.Tongz.url;
//console.log(url);

async function post(func, args) {
  let data = null;
  //console.log(func,args);
  switch (func) {
    case 'register': case 'balance':
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

exports.post = post;
