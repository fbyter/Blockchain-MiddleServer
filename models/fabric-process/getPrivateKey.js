'use strict';
const db = require('../db');

/* 通过用户名获取保存在db中的私钥 */
exports.getPrivateKey = (name) => {
  return new Promise(async (resolve, reject) => {

    let response = null;
    let flag = false;

    await db.getUserMsg(name, "key").then(dbResult => {
      if(!dbResult){
        response = {
          status: false,
          key: null
        };
      }
      else{
        flag = true;
        response = {
          status: true,
          key: dbResult.key
        };
      }
    });

    console.log(response);

    if (flag) resolve(response);
    else reject(response)
  });

};
