var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');

var session = require('express-session');

var db = require('../db');



/* GET character create page */
router.get('/create', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	//Add the map class to html body
	pageData.bodyClass = 'map'}
	res.render('game/create', pageData);
});

/*POST character create page. */
router.post('/create', function (req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	
	var postedForm =req.body;
	if (postedForm.Name == null){
		pageData.errorMsg += "Invalid name." ;
		res.render('game/create', pageData);
	} else {
		//Do something with character details
		pageData.outputText = 'Welcome to Polemios, '+postedForm.Name +"! Your character has been created";
		res.render('game/create', pageData);
		}
});
module.exports = router;
