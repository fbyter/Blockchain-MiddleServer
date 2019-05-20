'use strict';
const request = require('../request');

/* pay or coin */
exports.pay = function(args) {
  return new Promise(async (resolve, reject) => {
    let flag = false;
    let response = await request.post('pay', args).then((response) => {
      flag = true;
      return response
    });

    //console.log('xxx',response);
    if (flag) resolve(response);
    else reject(response);
  })
};

