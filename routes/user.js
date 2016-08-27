var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');

var session = require('express-session');

var db = require('../db');

var crypto = require('crypto');

/* GET sign up page. */
router.get('/signup', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	// Add additional javascript files
	pageData.javascriptFiles.push('signup.js');
	pageData.javascriptFiles.push('vendor/sha512.min.js');
	res.render('user/signup', pageData);
});

/* POST sign up page. */
router.post('/signup', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	// Add additional javascript files
	pageData.javascriptFiles.push('signup.js');
	pageData.javascriptFiles.push('vendor/sha512.min.js');

	var postUser = req.body;
	if (postUser.username == null || postUser.p == null || postUser.p.length != 128 || postUser.email == null){
		pageData.errorMsg += "Invalid registration details. ";
		res.render('user/signup', pageData);
	} else {
		// Check for duplicate username
		db.runSqlSingleResult('SELECT username FROM polemios_users WHERE username = ?', [postUser.username], function(dbUser){
			if (dbUser != null){
				// Username already exists
				pageData.errorMsg += "Username already taken! ";
				res.render('user/signup', pageData);
			} else {
				// Secure password
				var salt = crypto.randomBytes(64).toString('hex');
				var hash = crypto.createHmac('sha512', salt);
				hash.update(postUser.p);
				var pass = hash.digest('hex');
				// Insert new user
				db.runSql('INSERT INTO polemios_users (username, email, password, salt) values (?, ?, ?, ?)', [postUser.username, postUser.email, pass, salt], function(result){
					// Check DB
					db.runSqlSingleResult('SELECT username FROM polemios_users WHERE username = ?', [postUser.username], function(dbUser){
						if (dbUser == null){
							// Failed. No user
							pageData.errorMsg += "Error creating user. Please contact Polemios Support. ";
						} else {
							// Success
							req.session.user = dbUser;
							pageData.user = dbUser;
							pageData.successMsg += postUser.username + " created successfully! ";
						}
						res.render('user/signup', pageData);
					});
				});
			}
		});
	}
});


/* GET sign in page. */
router.get('/signin', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	// Add additional javascript files
	pageData.javascriptFiles.push('signup.js');
	pageData.javascriptFiles.push('vendor/sha512.min.js');
	res.render('user/signin', pageData);
});


/* POST sign in page. */
router.post('/signin', function(req, res, next) {
	var pageData = commonRoute.initPageData(req.session);
	// Add additional javascript files
	pageData.javascriptFiles.push('signup.js');
	pageData.javascriptFiles.push('vendor/sha512.min.js');
	
	// Get redirect location
	var redirect_loc = req.get('Referrer');
	if (redirect_loc == null || redirect_loc == ""){
		if (postUser.redirect_loc != null && postUser.redirect_loc != ""){
			redirect_loc = postUser.redirect_loc;
		} else {
			// Default redirect to home
			redirect_loc = "/";
		}
	}
	//FIXME Prevent unvalidated redirection
	
	var postUser = req.body;
	if (postUser.username == null || postUser.p == null || postUser.p.length != 128){
		pageData.errorMsg += "Invalid login details. ";
		res.render('user/signin', pageData);
	} else {
		db.runSqlSingleResult('SELECT username, salt FROM polemios_users WHERE username = ?', [postUser.username], function(dbUser){
			if (dbUser == null){
				// Invalid username
				pageData.errorMsg += "Invalid username. ";
				//FIXME Prevent username enumeration
				res.render('user/signin', pageData);
			} else {
				var hash = crypto.createHmac('sha512', dbUser.salt);
				hash.update(postUser.p);
				var pass = hash.digest('hex');
				// Test user
				db.runSqlSingleResult('SELECT username FROM polemios_users WHERE username = ? AND password = ?', [postUser.username, pass], function(dbUser){
					if (dbUser == null){
						// Password test failed
						pageData.errorMsg += "Invalid password. ";
						//FIXME Prevent password enumeration
						res.render('user/signin', pageData);
					} else {
						req.session.user = dbUser;
						pageData.user = dbUser;
						pageData.successMsg += "Welcome "+dbUser.username+"!";
						//TODO Use redirect_loc
						res.render('user/signin', pageData);
					}
				});
			}
		});
	}
});


/* GET sign out. */
router.get('/signout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/user/signin');
});
module.exports = router;
