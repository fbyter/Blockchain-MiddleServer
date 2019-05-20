'use strict';
const client = require('./fabricClient');
const fabric_conf = require('../conf/fabric');

/* 通过用户名获取保存在区块链中的公钥 */
exports.getPublicKey = (name) => {
  return new Promise(async (resolve, reject) => {
    //create public/private key
    let flag = false;
    let response = null;

    //get public key for user $name
    let fcn = fabric_conf.invoke.getKey;

    await client.queryByChaincode(fcn, [name]).then(result => {
      //console.log(result, result[0]);
      //console.log(Object.keys(result[0]));
      let result0 = result[0];
      let keys = Object.keys(result0);
      //error
      if(keys.includes('details')){
        response = {
          code: result0['code'],
          msg: result0['details']
        };
      }
      else{
        flag = true;
        let resultJson = JSON.parse(result0.toString());
        response = {
          key: resultJson.pubkey,
          name: resultJson.user
        };
        //response.key 是json串{"pubkey":"xxx","user":"yyy"}
      }
    });
    //flag = true;
    console.log(response);

    if (flag) resolve(response);
    else reject(response)

  });

};
