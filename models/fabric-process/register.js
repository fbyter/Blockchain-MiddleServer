'use strict';
const client = require('./client');
const fabric_conf = require('../conf/fabric');
const keyPair = require('../keyPair');

exports.register = (name) => {
  return new Promise(function (resolve, reject) {
    //create public/private key
    let flag = false;
    let keys = keyPair.createKey();

    //store public key for user $name
    let msg = {
      user: name,
      pubkey: `-----BEGIN PUBLIC KEY-----\n${keys.public}\n-----END PUBLIC KEY-----`
    };
    let fcn = fabric_conf.invoke.storeKey;

    /*
    client.queryByChaincode(fcn, JSON.stringify(msg)).then(result => {
      if(result.get("code") === "success")
      flag = true;
    });
    */
    flag = true;

    if(flag) resolve(keys.private);
    else reject(flag)

  });

  //send pubkey to fabric-resource chaincode
  /*resultMap = fabric-resource.chaincode2.invoke("storePubKey", formatArgs(msg));
  if (resultMap.get("code").equals("success")) {
    log.debug("store public key success");
    pukToUser.put(PUK, userName);
    return keys.private;
  }
  else return null;*/

  //return keys.private;
};
