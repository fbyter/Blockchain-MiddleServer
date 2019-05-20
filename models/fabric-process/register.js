'use strict';
const client = require('./fabricClient');
const fabric_conf = require('../conf/fabric');
const keyPair = require('../keyPair');
const request = require('../request');

/* register is create keyPair; storePubKey and return privateKey*/
exports.register = (name) => {
  return new Promise(async (resolve, reject) => {
    //create public/private key
    let flag = false;
    let keyPairs = keyPair.createKey();
    let response = null;

    //store public key for user $name
    let msg = {
      user: name,
      pubkey: "-----BEGIN PUBLIC KEY-----\n" + keyPairs.public + "\n-----END PUBLIC KEY-----"
    };
    let fcn = fabric_conf.invoke.storeKey;
    let args = [JSON.stringify(msg)];

    //nodejs sdk storePubKey function has serious bug!
    /*await client.queryByChaincode(fcn, args).then(result => {
      let result0 = result[0];
      let keys = Object.keys(result0);
      if(keys.includes('code')) {
        response = {
          code: result0['code'],
          msg: result0['details']
        };
      }
      else {
        flag = true;
        response = {
          key: keyPairs.private
        }
      }
    });*/

    //so we use java web server to storePubKey
    response = await request.post('register', {name:name}).then((response) => {
      flag = true;
      return response
    });

    //console.log('xxx',response);
    if (flag) resolve(response);
    else reject(response)

  });

  //return keys.private;
};
