'use strict';
const crypto = require('crypto');
/*const java = require('java');
const KeyPairGenerator = java.import('java.security.KeyPairGenerator');*/

let keySeed = crypto.createECDH('secp256k1');

exports.createKey = () => {
  keySeed.generateKeys();
  const publicKey = keySeed.getPublicKey().toString('base64');
  const privateKey = keySeed.generateKeys().toString('base64');
  return {
    public: publicKey,
    private: privateKey
  }
};