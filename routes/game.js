var express = require('express');
var router = express.Router();
var log = require('winston');
var commonRoute = require('./common');

var db = require('../db');
var gameData = require('../gameData');
var helper = require('../gameHelper');

testLogin = function(req, res){
	if (req.session && req.session.user){
		return true;
	}
	// Access denied. Redirect to login page
	res.redirect('/user/signin?reason=access_denied');
	return false;
};

createBasePageData = function(req){
	var pageData = commonRoute.initPageData(req.session)
	pageData.game = {
		races: gameData.races,
		factions: gameData.factions, 
		weapons: gameData.weapons,
		armours: gameData.armours
	};
	return pageData;
}

gameRouteInitNoCharacter = function(req, res){
	testLogin(req, res);
	return createBasePageData(req);
}

gameRouteInit = function(req, res, next){
	testLogin(req, res);
	testCharacter(req, res, function(){
		var pageData = createBasePageData(req);
		pageData.javascriptFiles.push('play.js');
		pageData.player = req.session.player;
		if (pageData.player && pageData.player.mapId){
			pageData.map = helper.getMapFromPlayer(pageData.player);
		}
		next(pageData);
	});
};

/* Return true if the user has a character, false otherwise */
hasCharacter = function(req, next){
	if (req.session && req.session.player){
		next(true);
	} else {
		helper.getPlayer(req.session.user.userId, function(player){
			if (player != null){
				req.session.player = player;
				next(true);
			} else {
				next(false);
			}
		});
	}
}

/* Redirects to create character if user has no character. */
testCharacter = function(req, res, next){
	hasCharacter(req, function(hasChar){
		if (!hasChar){
			res.redirect('/game/create?no_character=true');
		} else {
			next();
		}
	});
}


/* GET character create page */
router.get('/create', function(req, res, next) {
	var pageData = gameRouteInitNoCharacter(req, res);
	hasCharacter(req, function(hasChar){
		if (hasChar){
			// Don't allow multiple characters
			res.redirect('/game/play?has_character=true');
		} else {
			res.render('game/create', pageData);
		}
	});
});

/*POST character create page. */
router.post('/create', function (req, res, next) {
	var pageData = gameRouteInitNoCharacter(req, res);
	hasCharacter(req, function(hasChar){
		if (hasChar){
			// Don't allow multiple characters
			res.redirect('/game/play?has_character=true');
		} else {
			var postedForm = req.body;
			//TODO Input validation
			if (!postedForm.name){
				pageData.errorMsg += "No name provided. ";
			}
			if (!postedForm.race){
				pageData.errorMsg += "No race selected. ";
			} else if (postedForm.race <= 0 || postedForm.race > gameData.races.length){
				pageData.errorMsg += "Invalid race selected. ";
			}
			if (pageData.errorMsg == ''){
				var raceId = postedForm.race;
				db.runSqlSingleResult('SELECT name FROM player WHERE name = ?', [postedForm.name], function(dbPlayer){
					if (dbPlayer != null){
						// Character name already taken
						pageData.errorMsg += "Character name already taken! ";
						res.render('game/create', pageData);
					} else {
						// Insert player
						db.runSql('INSERT INTO player (userId, name, raceId, mapId, health) values (?, ?, ?, 1, ?)', [req.session.user.userId, postedForm.name, raceId, helper.playerDefaultMaxHealth], function(result){
							if (result.insertId){
								db.runSql('INSERT INTO player_faction (playerId, factionId, fame) SELECT ?, factionId, fame FROM race_faction_default WHERE raceId = ?', [result.insertId, raceId], function(result2){
									if (result2.insertId){
										console.log('Created character: '+postedForm.name);
										res.redirect('/game/create?user_created=true');
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
		}
	});
});

viewPlay = function(req, res, pageData, full){
	// Get enemies at current map
	helper.getEnemiesAtMap(pageData.map.mapId, function(enemies){
		pageData.locationEnemies = enemies;
		
		// Get players at current location
		helper.getPlayersAtPlayer(pageData.player, function(players){
			pageData.locationPlayers = players;
			
			helper.getLocationAtPlayer(pageData.player, function(location, locationType){
				pageData.location = location;
				pageData.locationType = locationType;
			
				//TODO More stuff
				// Display the full page or just the template
				if (full){
					res.render('game/play', pageData);
				} else {
					res.render('templates/play', pageData);
				}
			});
		});
	});
}

/* GET play page */
router.get('/play', function (req, res, next){
	gameRouteInit(req, res, function(pageData){
		// Add messages from query string
		if (req.query.user_created == 'true'){
			pageData.successMsg += 'Welcome to Polemios, '+pageData.player.name +"! Your character has been created! ";
		} else if (req.query.has_character == 'true'){
			pageData.successMsg += 'Welcome to Polemios, '+pageData.player.name +"! ";
		}
		
		viewPlay(req, res, pageData, true);
	});
});

/* POST play page */
router.post('/play', function (req, res, next){
	gameRouteInit(req, res, function(pageData){
		var postBody = req.body;
		var player = pageData.player;
		if (postBody.move){
			helper.movePlayer(player, postBody.move, function(err, moved){
				if (!moved){
					console.log('Player moved: '+postBody.move);
					pageData.errorMsg += err;
				}
				viewPlay(req, res, pageData);
			});
		} else {
			viewPlay(req, res, pageData);
		}
	});
});


module.exports = router;
