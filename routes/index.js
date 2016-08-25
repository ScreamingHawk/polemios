var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	// Add the map class to html body
	pageData.bodyClass = 'map';
	res.render('index', pageData);
});

/* GET character create page */
router.get('/create', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	//Add the map class to html body
	pageData.bodyClass = 'map';
	res.render('create'. pageData);
});

/*POST character create page. */
router.post('/create', function (req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	pageData.bodyClass = 'map';
	var postedForm =req.body;
	if (postedForm.Name == null){
		pageData.errorMsg += "Invalid name." ;
		res.render('create', pageData);
	} else {
		//Do something with character details
		pageData.outputText = 'Welcome to Polemios, '+postedForm.Name +"!";
		res.render('create', pageData);
		}
});

module.exports = router;
