const fabric_register = require('./fabric-process/register');

exports.register = fabric_register.register;

exports.dbOpt = {
  in: "insert",
  qu: "select",
  up: "update"
};