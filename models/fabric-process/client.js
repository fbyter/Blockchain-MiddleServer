'use strict';
const Fabric_Client = require('fabric-client');
//const sdkUtils = require('fabric-client/lib/utils');
const Fabric_CA_Client = require('fabric-ca-client');
const fabric_conf = require('../conf/fabric');
const path = require('path');
const fs = require('fs');
const rootPath = require('../conf/dirname').rootPath;


/* some important parameters */
const ip = fabric_conf.ip;
let options = fabric_conf.options;
options.privateKeyFolder = path.join(rootPath, options.privateKeyFolder);
options.signedCert = path.join(rootPath, options.signedCert);
//console.log(options.signedCert);

/* new a fabric-process client */
let fabric_client = new Fabric_Client();
let fabric_ca_client = null;
let channel = null;
let peer = null;
let order = null;

/* other parameters */
let admin_user = null;
let result = null;
let tx_id = null;
const store_path = path.join(rootPath, fabric_conf.store_path);
const jsonPath = {path: store_path};
//console.log(store_path);

/* connect to fabric network and set admin as client's id */
exports.initialization = () => {
  //key and certificate of admin
  let createUserOpt = {
    username : options.user_id,
    mspid : options.msp_id,
    cryptoContent : {
      //privateKey : getKeyFilesInDir(privateKeyFolder)[0],
      //signedCert : options.signedCert
      privateKeyPEM: fs.readFileSync(getKeyFilesInDir(options.privateKeyFolder)[0], 'utf-8'),
      signedCertPEM: fs.readFileSync(options.signedCert, 'utf-8')
    },
    skipPersistence: true
  };
  //console.log(createUserOpt.cryptoContent.privateKey.toString() + "\n\n" + createUserOpt.cryptoContent.signedCert.toString());

  //
  Fabric_Client.newDefaultKeyValueStore(jsonPath).then(state_store => {
    //assign the store to the fabric-resource client, certificate
    fabric_client.setStateStore(state_store);

    //create user admin
    fabric_client.createUser(createUserOpt).then(user => {
      admin_user = user;
      console.log('successful create user for fabric client: ' + user.getName() + '\n');

      //assign admin to client
      fabric_client.setUserContext(user, true).then(()=> {
        //create channel,peer,order objects
        channel = fabric_client.newChannel(fabric_conf.channel_id);
        peer = fabric_client.newPeer(getUrl(fabric_conf.peer));
        order = fabric_client.newPeer(getUrl(fabric_conf.order));
        channel.addPeer(peer);
        channel.addOrderer(order);
        //console.log(channel.getOrderers().toString());
        //console.log(channel.getPeers().toString())

      }).catch(err => {
        console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
        throw new Error('Failed to setUserContext')
      });
    }).catch(err => {
      console.error('Failed to create and persist admin. Error: ' + err.stack ? err.stack : err);
      throw new Error('Failed to createUser admin')
    });
  })

};

exports.queryByChaincode = (fcn, args) => {
  let request = {
    chaincodeId: fabric_conf.chaincode_id,
    //fcn: fcn,
    fcn: "getPubKey",
    //args: args
    args: ['test']
  };

  // send the query proposal to the peer
  return channel.queryByChaincode(request).then((query_responses) => {
    //typeof query_responses is object(json)
    console.log("Query has completed, checking results");

    if(query_responses['code'] === "success") console.log("fuck");
    else console.log("shit");
    result = query_responses;

    for(let key in result) {
      console.log(result[key]);
    }

    /*if (query_responses && query_responses.length === 1) {
      if (query_responses[0] instanceof Error) {
        console.error("error from query = ", query_responses[0]);
      } else {
        console.log("Response is ", query_responses[0].toString());
      }

    } else {
      console.log("No payloads were returned from query");
    }*/
  }).catch(err => {
    console.log('query, error')
  })

};

//create k-v store for admin
exports.enroll = () =>{
  Fabric_Client.newDefaultKeyValueStore(jsonPath).then(state_store => {
  //assign the store to the fabric-resource client, certificate
  fabric_client.setStateStore(state_store);

  //client <= crypto suite <= KeyStore
  let crypto_store = Fabric_Client.newCryptoKeyStore(jsonPath); //加密密钥存储
  let crypto_suite = Fabric_Client.newCryptoSuite(); //加密密钥
  crypto_suite.setCryptoKeyStore(crypto_store);//key

  fabric_client.setCryptoSuite(crypto_suite);

  //be sure to change the http to https when the CA is running TLS enabled
  fabric_ca_client = new Fabric_CA_Client(getUrl(fabric_conf.ca), fabric_conf.ca.tlsOptions , 'ca.example.com', crypto_suite);
  //check to see if the admin is already enrolled
  return fabric_client.getUserContext('admin', true)

  }).then(user_from_store => {
    if( user_from_store && user_from_store.isEnrolled()) {
    admin_user = user_from_store
    } else {
    //re enroll admin with CA server
      return fabric_ca_client.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
      }).then( enrollment => {
        //successfully enrolled admin user 'admin'
        return fabric_client.createUser({
          username: 'admin',
          mspid: 'Org1MSP',
          cryptoContent: {
            privateKeyPEM: enrollment.key.toBytes(),
            signedCertPEM: enrollment.certificate
          }
        })
      }).then(user => {
        admin_user = user;
        return fabric_client.setUserContext(admin_user)
      }).catch(err => {
        console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
        throw new Error('Failed to enroll admin')
      })
    }
  });
};

function getKeyFilesInDir(dir) {
  let files = fs.readdirSync(dir);
  let keyFiles = [];
  files.forEach(fileName => {
    let filePath = path.join(dir, fileName);
    if(fileName.endsWith('_sk')) {
      keyFiles.push(filePath)
    }
  });

  return keyFiles;
}

function getUrl(json) {
  return json.protocol+'://'+ip+':'+json.port
}

function fuck(i) {
  return `!!!---fuck#${i.toString()}---!!!`;
}

//console.log('start:'+admin_user.getName());
//exports.initialization();
//exports.queryByChaincode();
//exports.login = {}
//exports.balance = {}
//exports.high = {}