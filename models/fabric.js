const Fabric_Client = require('fabric-client');
const Fabric_CA_Client = require('fabric-ca-client');
const fabric_conf = require('../conf/fabric');
const path = require('path');

//import fabric sign in parameters
const protocol = fabric_conf.protocol;

//new a fabric client
let fabric_client = new Fabric_Client();
let fabric_ca_client = null;

//create channel,peer,order objects
/*let channel = fabric_client.newChannel(fabric_conf.channel.name);
let peer = fabric_client.newPeer(getUrl(fabric_conf.peer));
let order = fabric_client.newPeer(getUrl(fabric_conf.order));
channel.addPeer(peer);
channel.addOrderer(order);*/

//create client and user objects
let admin_user = null;
let member_user = null;
let tx_id = null;
let store_path = path.join(path.resolve(__dirname), fabric_conf.store_path);
let jsonPath = {path: store_path};

//create k-v store for admin
exports.start = ()=>{Fabric_Client.newDefaultKeyValueStore(jsonPath).then(state_store => {
  fabric_client.setStateStore(state_store);

  //client <= crypto suite <= KeyStore
  let crypto_store = Fabric_Client.newCryptoKeyStore(jsonPath); //加密密钥存储
  let crypto_suite = Fabric_Client.newCryptoSuite(); //加密密钥
  crypto_suite.setCryptoKeyStore(crypto_store);

  fabric_client.setCryptoSuite(crypto_suite);


  // be sure to change the http to https when the CA is running TLS enabled
  fabric_ca_client = new Fabric_CA_Client(getUrl(fabric_conf.ca), fabric_conf.tlsOptions , 'ca.example.com', crypto_suite);

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
      throw new Error('Failed to enroll admin')
    })
  }

});};


getUrl = (json) => {
  return json.protocol+'://'+json.ip+':'+json.port
};

exports.register = (name, password) => {
  //if(name);
  return key = 'hairong';
};

//exports.login = {}
//exports.balance = {}
//exports.high = {}