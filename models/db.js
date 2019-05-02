var mysql = require('mysql')

var dbConf = require('../conf/db.json');
//var fs = require('fs')
//var dbConfig = JSON.parse(fs.readFileSync('../conf/db.json').toString());

//set mysql connection pool
var pool = mysql.createPool({
    host: dbConf.host,
    user: dbConf.user,
    password: dbConf.password,
    database: dbConf.database
});

//add query function to db module
exports.query = (sql, arr, callback) => {
    //build connection with mysql server
    //parameter is callback function, return err or connection
    pool.getConnection( (err, connection) => {
        if (err) {
            throw err;
        }
        connection.query(sql, arr, (error, results, fields) => {
            //return connection to pool for others to use
            connection.release();
            if (error) throw error;
            callback && callback(results, fields)
        })
    })
};
