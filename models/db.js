'use strict';
const mysql = require('mysql');
const dbConf = require('./conf/db');
//var fs = require('fs')
//var dbConfig = JSON.parse(fs.readFileSync('../conf/db.json').toString());

//set mysql connection pool
const config = {
  host: dbConf.host,
  user: dbConf.user,
  password: dbConf.password,
  database: dbConf.database
};

const pool = mysql.createPool(config);

//add query function to db module
const query2 = (opt, field, args, callback) => {
  //build connection with mysql server
  //parameter is callback function, return err or connection
  pool.getConnection( (err, connection) => {
    if (err) {
      console.log('mysql connection error');
      throw err;
    }

    let sql = getSql(opt, field);
    if(opt === "error") {
      console.log("sql opt error");
      throw opt;
    }
    //console.log(args);
    connection.query(sql, args, (error, results, fields) => {
      //return connection to pool for others to use
      connection.release();
      if (error) {
        console.log('mysql query error: '+ `'${sql} ${args.toString()}'`);
        throw error;
      }
      callback && callback(results, fields)
    })
  })
};

const query = (opt, field, args) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) reject(err);
      else {
        let sql = getSql(opt, field);
        if(sql === 'error') reject('opt error');
        else connection.query(sql, args, (err, ...arg) => {
          if(err) reject(err);
          else resolve(arg); //返回的是数组[result, fields]
          connection.release();
        });
      }
    });
  });
};

exports.query = query;

exports.isExist = async (name) => {
  let isExist = false;
  let what = 'count(*)';
  let [result, fields] = await query("select", what, [name]);
  //console.log(result, fields, result[0], typeof result[0][what]);
  if(result[0][what] === 1) isExist = true;
  return new Promise((resolve, reject) => { resolve(isExist) })
  //return true;
};

exports.insertOne = async (args) => {
  let res = 0;
  let field = '';
  let result = await query("insert", field, args);
  //console.log(result[0].affectedRows);
  return new Promise((resolve, reject) => {
    resolve(Boolean(result[0].affectedRows))
  })
  //return res;
};

exports.getUserMsg = async (name, whats="all") => {
  let what;
  if(whats === "all")
    what = '*';
  else
    what = whats;
  let [result, fields] = await query("select", what, [name]);
  //console.log(result, fields, result[0]);
  //result是数组, result[0]是 RowDataPacket{name:'a',password:'b',key:'c',email:'d'}
  return new Promise((resolve, reject) => { resolve(result[0]) })
};

exports.getAllUsers = async () => {
  let what = 'name';
  let [result, fields] = await query("selectAll", what, []);
  //console.log(result, typeof result);
  //result是数组, [{name:'1'},{name:'2'} ...]
  return new Promise(((resolve, reject) => { resolve(result) }))
};

const getSql = (opt, field) => {
  let sql = '';
  switch (opt) {
    case 'insert':
      sql = dbConf.sql.insert;
      break;
    case 'select':
      sql = dbConf.sql.select;
      break;
    case 'selectAll':
      sql = dbConf.sql.selectAll;
      break;
    case 'update':
      sql = dbConf.sql.update;
      break;
    default:
      sql = "error"
  }

  return  sql.replace(/field/, field);
};
