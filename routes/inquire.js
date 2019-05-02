var express = require('express');
var router = express.Router();

/* GET account balance; currency num. */
router.get('/balance', function(req, res, next) {
    if (req.cookie.isVisit) {
        req.cookie.isVisit++;
    } else {
        req.cookie.isVisit = 1;
    }
    res.render('index', { title: 'Express' });
});

module.exports = router;
