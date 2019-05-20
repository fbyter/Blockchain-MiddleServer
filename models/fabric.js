const fabric_register = require('./fabric-process/register');
const fabric_getPublicKey = require('./fabric-process/getPublicKey');
const fabric_balance = require('./fabric-process/balance');
const fabric_pay = require('./fabric-process/pay');
const requests = require('./request');

exports.register = fabric_register.register;
exports.getPubKey = fabric_getPublicKey.getPublicKey;
exports.balance = fabric_balance.balance;
exports.pay = fabric_pay.pay;


exports.post = requests.post;
