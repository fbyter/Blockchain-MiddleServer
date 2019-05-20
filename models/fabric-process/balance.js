'use strict';
const client = require('./fabricClient');
const fabric_conf = require('../conf/fabric');
const getKey = require('./getPublicKey');

/* get balance for $name */
exports.balance = (name) => {
  return new Promise(async (resolve, reject) => {
    let flag = false;
    let response = null;

    const invokes = fabric_conf.invoke;

    //first get public key
    await getKey.getPublicKey(name).then(async result => {
      let publicKey = result.key;
      publicKey = publicKey.replace(/\n/g, '\\\\n').replace(/\r/g, '\\\\r');
      //publicKey = publicKey.replace(/\r/g, '\\\\r');

      //console.log(publicKey);
      await client.queryByChaincode(invokes.query, [publicKey]).then(result => {
        //result is {[buffer]} , to json
        let result0 = JSON.parse(result[0].toString());
        let keys = Object.keys(result0);
        //console.log(result,result[0].toString());

        //error
        if(keys.includes('code')){
          response = {
            code: result0['code'],
            msg: result0['details']
          };
        }
        else{
          flag = true;
          let balance = 0;
          for(let i=0; i< result0.length; i++) {
            if(!result0[i])
              balance += result0[i]['amount'];
          }
          response = {
            //need to parse, but we don't know the
            balance: balance
          };
        }
      });
    } , error => {
      response = error;
      response.note = `failed to getPublicKey for ${name}`
    });

    //flag = true;
    console.log(response);
    if(flag) resolve(response);
    else reject(response)

  });
};
