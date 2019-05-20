'use strict';
const client = require('./fabricClient');
const fabric_conf = require('../conf/fabric');
const getPubk = require('./getPublicKey');
const getPrik = require('./getPrivateKey');
const crypto = require('crypto');

/* get balance for $name */
exports.payment = (amount=0.0, payer, owner7, coinFlag=false, payMethod=fabric_conf.payment.payMethod) => {
  //const encoding = new UnicodeEncoding();

  return new Promise(async (resolve, reject) => {
    let flag = false;
    let response = null;
    const invokes = fabric_conf.invoke;
    let fcn = null;

    /* parameters */
    const payerPubk = await getPubk.getPublicKey(payer);
    const owner = await getPubk.getPublicKey(owner7);
    const lock = owner;

    // pay message structure
    const label = fabric_conf.payment.label; //货币类别
    const lockScript = lock;  // 锁定脚本.
    const identity = payerPubk;   // 铸币身份识别.
    const ownerUtxo = owner;
    let payJson = []; //支付结构
    let payMap = null;

    /* create  */
    let ownerArray;
    ownerArray = [owner, payMethod];
    // outputs.
    let output = {
      amount: amount,
      owner: ownerArray,
      labels: label,
      lockScript: lockScript
    };


    if (coinFlag) { //铸币
      // coinRequest
      let coinRequest = {
        identity: identity,
        outputs: [output]
      };

      // 读取私钥
      let temp = await getPrik.getPrivateKey(payer);
      let privateKey = temp.key;
      let coinContent = unescape(encodeURIComponent(JSON.stringify(coinRequest))); //utf-8
      let data = [];
      for(let i=0; i<coinContent.length; i++) {
        data.push(coinContent.charCodeAt(i))
      }
      let sign = Signature(privateKey, data);   // 数字签名.

      // 构造交易块
      let coin = [coinContent, sign, identity, owner];

      for(let i=0; i<coin.length; i++) {
        payJson += [coin[i].toString()]
      }
      fcn = invokes.coin;
    }
    else {
      // inputs
      let input = null;

      // request.
      let request = createRequest(payer, input, output, privateKey);
      if (!request) {
        payMap = {code: "error"};
        return payMap;
      }

      // 支付.
      let pay = [];

      // 读取私钥.
      // String privateKey = getPrivateKey(payer);
      let content = request.toString();
      let data = [];
      for(let i=0; i<content.length; i++) {
        data.push(content.charCodeAt(i))
      }

      // 脚本支付.
      let tx = request.inputs; //[]
      let txids = []; //[]
      for (let i = 0; i < tx.length; i++) {
        let txjson = tx[i];
        txids[i] = txjson["txid_j"];
      }
      let unlockScript = createUnlockScript(txids, data); // 解锁脚本 []
      if (unlockScript == null) {
        payMap = {code: "error"};
        return payMap;
      }

      request.unlockcodeparas = unlockScript;
      pay = [request.toString(), content, identity, ownerUtxo];

      for(let i=0; i<pay.length; i++) {
        payJson += [pay[i].toString()]
      }
      fcn = invokes.pay;
    }
    //payment(float mount, String payer, String owner, String lock, int flag, String ownerType)

    /* fabric invoke */
    await client.queryByChaincode(fcn, payJson).then(result => {
      let result0 = result[0];
      console.log(result0.toString());
      flag = true;
      response = {
      }
    }, error => {
      //failed to get publicKey (almost impossible)
      response = error;
      response.note = `failed to payment`
    });

    //console.log(response);
    if (flag) resolve(response);
    else reject(response)

  });
};


/**
 * @return {string}
 */
function Signature(privateKey, data) {
  const sign = crypto.createSign('SHA256withECDSA');
  sign.update(data);
  const signatures = sign.sign(privateKey);
  return signatures.toString();
}

async function createRequest(payer, input, output, key) {

  //let player;
  let inputs = [];
  let outputs = [];
  let request = {}; //{}
  let inMount = 0;
  let mount = output["amount"];  // 待支付金额.

  // 获取用户的utxos.
  let temp = await client.queryByChaincode(fabric_conf.invoke.query, [payer]);
  //?????????????????????????????????????????
  let sortUtxos = temp[0].toString(); //map
  if (sortUtxos == null) {
    return null;
  }

  // 确定使用的utxo组合.
  let i;
  for (i = 0; i < sortUtxos.length; i++) {
    inMount += sortUtxos[i].getValue();
    if (inMount >= mount) {
      break;
    }
  }

  // 是否余额不足.
  if ( i === sortUtxos.length) {
    return null;
  }

  // 构造inputs.
  for (let j = 0; j <= i; j++) {
    input = {};
    input.txid_j =  sortUtxos[j].getKey();
    inputs.push(input);
  }

  // 构造outputs.
  outputs.push(output);
  if (inMount > mount) {
    let output = {}; //json
    let change = inMount - mount;
    output.amount = change;
    let pk = key;
    if (pk == null) {
      return null;
    }

    let ownerArray = [];
    ownerArray.push(pk);
    ownerArray.push(fabric_conf.payment.payMethod);
    output.owner = ownerArray;
    output.lockScript = pk;
    output.labels = 1;

    outputs.push(output);
  }

  request.inputs = inputs;
  request.outputs = outputs;

  return request;
}

async function createUnlockScript(txids, data, key) {
  let unlockScript = [txids.length];
  let pukToUser = {};
  let i = 0;
  for (let s of txids) {
    let tx = [s];
    let result = await client.queryByChaincode(fabric_conf.invoke.queryid, tx);
    //.then
    if (result.get("code").equals("success")) {
      let jsonObject = JSON.parse(result.get("data")); //?
      let user = pukToUser.get(jsonObject.ownerUTXO);
      let output = jsonObject.outputs;
      if (output.owner[1] === fabric_conf.payment.payMethod) {
        unlockScript[i] = Signature(key, data);
      }
      else {
        //String lockScript = output.getString("lockScript");
        let userLinked = {}, userMap = {};
        let users = userLinked.get(userMap.get(user)).split(",");
        //unlockScript[i] = Signature(getPrivateKey(users[1]), data) + "," + Signature(getPrivateKey(users[2]), data);
      }
    }
    else {
      return null;
    }
    //.then
    i++;
  }
  return unlockScript;
}
