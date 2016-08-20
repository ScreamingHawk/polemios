var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');

/* GET home page. */
router.get('/', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	res.render('index', pageData);
});

module.exports = router;
