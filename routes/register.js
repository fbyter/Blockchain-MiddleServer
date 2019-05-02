var express = require('express');
var router = express.Router();
var bodyParser = require('body-Parser')
var fabric = require('/models/fabric');
var db = require('/models/db');

//check password is illegal
var checkPasswd = (password = '') => {
    let regExist = /(?=.*\d)(?=.*[a-z])(?=.*[`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|])/i;
    let regNum = /^[0-9a-z`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|]{6,10}$/i;
    let regIllegal = /^[^0-9a-z`~!@#$%^&*()\-_=+,./;:?'"<>\[\]{}|]$/i;

    let flag = false;
    //empty?
    if(typeof password == 'string') {
        if(regExist.test(password) && regNum.test(password) && !regIllegal.test(password))
            flag = true
    }
    return flag
};

//register a user from fabric
var name ='';
var x = (name, password) => {
    if(name.length >0 && checkPasswd(password)) return '';
    var msg = fabric.register(name, password);
}

//add message to db
var sql = 'insert  '
var arr = msg
db.query()

/* GET home page. */
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    //res.render('index', { title: 'Express' });
    res.end('yes')
});
