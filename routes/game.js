var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');

var db = require('../db');
var gameData = require('../gameData');

testLogin = function(req, res){
	if (req.session && req.session.user){
		return true;
	}
	// Access denied. Redirect to login page
	res.redirect('/user/signin?reason=access_denied');
	return false;
};

gameRouteInit = function(req, res){
	testLogin(req, res);
	var pageData = commonRoute.initPageData(req.session);
	pageData.game = {
		races: gameData.races,
		factions: gameData.factions
	};
	return pageData;
};


/* GET character create page */
router.get('/create', function(req, res, next) {
	var pageData = gameRouteInit(req, res);
	res.render('game/create', pageData);
});

/*POST character create page. */
router.post('/create', function (req, res, next) {
	var pageData = gameRouteInit(req, res);
	
	var postedForm = req.body;
	//TODO Input validation
	if (!postedForm.name){
		pageData.errorMsg += "No name provided. ";
	}
	if (!postedForm.race){
		pageData.errorMsg += "No race selected. ";
	} else if (postedForm.race < 0 || postedForm.race >= gameData.races.length){
		pageData.errorMsg += "Invalid race selected. ";
	}
	if (!postedForm.gear){
		pageData.errorMsg += "No starting gear selected. ";
	} else if (postedForm.gear < 0 || postedForm.gear >= gameData.factions.length){
		pageData.errorMsg += "Invalid gear selected. ";
	}
	if (pageData.errorMsg == ''){
		db.runSqlSingleResult('SELECT name FROM player WHERE name = ?', [postedForm.name], function(dbPlayer){
			if (dbPlayer != null){
				// Character name already taken
				pageData.errorMsg += "Character name already taken! ";
				res.render('game/create', pageData);
			} else {
				// Insert player
				db.runSql('INSERT INTO player (userId, name, raceId, mapId) values (?, ?, ?, ?)', [req.session.user.userId, postedForm.name, postedForm.race, gameData.factions[postedForm.gear].startingMapId], function(result){
					if (result.insertId){
						db.runSql('INSERT INTO player_faction (playerId, factionId, fame) SELECT ?, factionId, fame FROM race_faction_default WHERE raceId = ?', [result.insertId, postedForm.race], function(result2){
							if (result2.insertId){
								console.log('Created character: '+postedForm.name);
								pageData.successMsg += 'Welcome to Polemios, '+postedForm.name +"! Your character has been created! ";
								res.render('game/create', pageData);
							} else {
								pageData.errorMsg += "Error creating character. Please contact support. ";
								res.render('game/create', pageData);
							}
						});
					} else {
						pageData.errorMsg += "Error creating character. Please contact support. ";
						res.render('game/create', pageData);
					}
				});
			}
		});
	} else {
		// Error
		res.render('game/create', pageData);	
	}
});

module.exports = router;
