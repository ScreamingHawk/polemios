var express = require('express');
var router = express.Router();
var log = require('../log');
var async = require("async");
var validator = require('validator');

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
	if (testLogin(req, res)){
		return createBasePageData(req);
	}
}

gameRouteInit = function(req, res, next){
	if (testLogin(req, res)){
		testCharacter(req, res, function(){
			var pageData = createBasePageData(req);
			pageData.javascriptFiles.push('play.js');
			var player = req.session.player;
			pageData.player = player;
			if (player){
				async.series([
					function(callback){
						if (player.mapId){
							pageData.map = helper.getMapFromPlayer(player);
						}
						callback();
					},
					function(callback){
						if (!player.weapons || !player.armour){
							helper.updatePlayerInventory(player, callback);
						} else {
							callback();
						}
					}
				], function(){
					next(pageData);
				});
			} else {
				next(pageData);
			}
		});
	}
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
			postedForm.name = validator.escape(postedForm.name);
			//TODO Input validation
			if (!postedForm.name){
				pageData.errorMsg += "No name provided. ";
			} else if (postedForm.name.length > 30){
				pageData.errorMsg += "Name cannot be more than 30 characters. ";
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
						db.runSql('INSERT INTO player (userId, name, raceId, mapId, health, mint) values (?, ?, ?, 1, ?, ?)', [req.session.user.userId, postedForm.name, raceId, helper.playerDefaultMaxHealth, helper.playerStartingMint], function(result){
							if (result.insertId){
								db.runSql('INSERT INTO player_faction (playerId, factionId, fame) SELECT ?, factionId, fame FROM race_faction_default WHERE raceId = ?', [result.insertId, raceId], function(result2){
									if (result2.insertId){
										log.info('Created character: '+postedForm.name);
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
	async.parallel([
		function(callback){
			// Get enemies at current map
			helper.getEnemiesAtMap(pageData.map.mapId, function(enemies){
				pageData.locationEnemies = enemies;
				callback();
			});
		}, 
		function(callback){
			// Get players at current location
			helper.getPlayersAtPlayer(pageData.player, function(players){
				pageData.locationPlayers = players;
				callback();
			});
		}, 
		function(callback){
			// Get location at current location
			helper.getLocationAtPlayer(pageData.player, function(location, locationType){
				pageData.location = location;
				pageData.locationType = locationType;
				callback();
			});
		}
	], function(){
		// Display the full page or just the template
		if (full){
			res.render('game/play', pageData);
		} else {
			res.render('templates/game/play', pageData);
		}
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
			// Move requested
			helper.movePlayer(player, postBody.move, function(err, moved){
				if (!moved){
					pageData.errorMsg += err;
				}
				viewPlay(req, res, pageData);
			});
		} else if (postBody.unequipleft || postBody.unequipright || postBody.equipleft || postBody.equipright) {
			// Equip or unequip weapon requested
			async.series([
				function(callback){
					if (postBody.unequipleft || postBody.unequipright){
						// unequip current weapon
						helper.unequipWeapon(player, postBody.unequipleft, callback);
					} else if (postBody.equipleft){
						// equip desired weapon left
						helper.equipWeapon(player, true, postBody.equipleft, callback);
					} else if (postBody.equipright){
						// equip desired weapon right
						helper.equipWeapon(player, false, postBody.equipright, callback);
					} else {
						callback();
					}
				},
			], function(){
				viewPlay(req, res, pageData);
			});
		} else if (postBody.unequipbody || postBody.equipbody) {
			// Equip or unequip weapon requested
			async.series([
				function(callback){
					if (postBody.unequipbody){
						// unequip current armour
						helper.unequipArmour(player, callback);
					} else if (postBody.equipbody){
						// equip desired armour right
						helper.equipArmour(player, postBody.equipbody, callback);
					} else {
						callback();
					}
				},
			], function(){
				viewPlay(req, res, pageData);
			});
		} else if (postBody.findEnemy){
			// Load an enemy to fight
			if (player.health > 0){
				helper.getEnemiesAtMap(pageData.map.mapId, function(enemies){
					for (var i = 0; i < enemies.length; i++){
						var enemy = enemies[i];
						if (enemy.enemyId == postBody.findEnemy){
							req.session.enemy = enemy;
							pageData.enemy = enemy;
							req.session.combatLog = [];
							pageData.combatLog = [];
							//TODO Random enemy type
							break;
						}
					}
					if (pageData.enemy == null){
						pageData.errorMsg += 'Could not find enemy to fight. ';
					}
					viewPlay(req, res, pageData);
				});
			} else {
				pageData.errorMsg += 'Ghosts can\t fight! ';
				viewPlay(req, res, pageData);
			}
		} else if (postBody.fightEnemy){
			// Fight the loaded enemy
			var enemy = req.session.enemy;
			if (enemy == null){
				pageData.errorMsg += 'No enemy to fight! ';
				return viewPlay(req, res, pageData);
			} else {
				var combatLog = req.session.combatLog;
				// Combat round
				attackEnemy(player, player.equipLeft, enemy, 'left', combatLog);
				if (enemy.health > 0){
					attackEnemy(player, player.equipRight, enemy, 'right', combatLog);
				}
				if (enemy.health > 0){
					// Enemy attacks
					var dmg = Math.round(helper.getRandomInt(90, 110) * enemy.damage / 100);
					if (player.equipBody == null){
						player.health -= dmg;
						combatLog.push(enemy.name + ' did ' + dmg + ' damage!');
					} else {
						// Arour blocks
						var armour = player.equipBody;
						dmg -= Math.round(helper.getRandomInt(armour.skill, 100) * armour.blocks / 100);
						//TODO incorporate faction bonuses
						if (dmg < 0){
							dmg = 0;
						}
						player.health -= dmg;
						combatLog.push(enemy.name + ' did ' + dmg + ' damage!');
						if (player.health > 0 && helper.skillCheck(200 - armour.skill)){
							// Player skills up
							armour.skill++;
							helper.updateArmourSkill(player, armour);
							combatLog.push('Your skill with ' + armour.name + ' increased!');
						}
					}
					helper.updatePlayerHealth(player);
				}
				pageData.enemy = enemy;
				pageData.combatLog = combatLog;
//				log.debug('Combat log: '+JSON.stringify(combatLog, null, 2));
				if (enemy.health <= 0){
					// Enemy killed. Reward player
					player.mint += enemy.mint;
					helper.updatePlayerMint(player);
					// Clear enemy info
					req.session.enemy = null;
					req.session.combatLog = null;
				}
				if (player.health <= 0){
					// Player killed
					combatLog.push(enemy.name + ' killed you!');
					// Clear enemy info
					req.session.enemy = null;
					req.session.combatLog = null;
					helper.killPlayer(player, function(){
						viewPlay(req, res, pageData);
					});
				} else {
					viewPlay(req, res, pageData);
				}
			}
		} else if (postBody.attackPlayer){
			if (player.health <= 0){
				// Current player is dead
				pageData.errorMsg += 'Ghosts can\'t fight! ';
				return viewPlay(req, res, pageData);
			}
			// Check player is still there
			helper.getPlayerIfAtPlayer(postBody.attackPlayer, player, function(attackedPlayer){
				if (attackedPlayer == null){
					pageData.errorMsg += 'The player is no longer there! ';
					return viewPlay(req, res, pageData);
				}
				if (attackedPlayer.health <= 0){
					pageData.errorMsg += 'The player is dead! ';
					return viewPlay(req, res, pageData);
				}
				// Attack the player
				var combatLog = [];
				//TODO Initiative
				// Combat round
				attackPlayer(player, player.equipLeft, attackedPlayer, 'left', combatLog);
				if (attackedPlayer.health > 0){
					attackPlayer(player, player.equipRight, attackedPlayer, 'right', combatLog);
				}
				// Combat round attacked player
				if (attackedPlayer.health > 0){
					attackPlayer(attackedPlayer, attackedPlayer.equipLeft, player, 'left', combatLog);
					if (player.health > 0){
						attackPlayer(attackedPlayer, attackedPlayer.equipRight, player, 'right', combatLog);
					}
				}
				helper.updatePlayerHealth(player);
				helper.updatePlayerHealth(attackedPlayer);
				
				async.parallel([
					function(callback){
						if (attackedPlayer.health <= 0){
							// Enemy killed. Reward player
							player.mint += attackedPlayer.mint;
							attackedPlayer.mint = 0;
							helper.updatePlayerMint(player);
							helper.killPlayer(attackedPlayer, function(){
								callback();
							});
						} else {
							callback();
						}
					},
					function(callback){
						if (player.health <= 0){
							// Player killed. Reward enemy
							attackedPlayer.mint += player.mint;
							player.mint = 0;
							helper.updatePlayerMint(attackedPlayer);
							helper.killPlayer(player, function(){
								callback();
							});
						} else {
							callback();
						}
					}
				], function(){
					pageData.combatLog = combatLog;
					return viewPlay(req, res, pageData);
				});
			});
		} else {
			// Location aware options
			helper.getLocationAtPlayer(player, function(location, locationType){
				if (locationType == 'store'){
					if (postBody.buyWeapon && location.sellsWeapons){
						// Buy weapon requested
						var weapon = gameData.weapons[postBody.buyWeapon - 1];
						if (location.maxMint >= weapon.mint){
							if (player.mint >= weapon.mint){
								helper.buyWeapon(player, weapon, function(){
									pageData.successMsg += "You purchased the "+weapon.name+"! ";
									viewPlay(req, res, pageData);
								});
							} else {
								pageData.errorMsg += "You can't afford the "+weapon.name+"! ";
								viewPlay(req, res, pageData);
							}
						} else {
							viewPlay(req, res, pageData);
						}
					} else if (postBody.buyArmour && location.sellsArmour){
						// Buy armour requested
						var armour = gameData.armours[postBody.buyArmour - 1];
						if (location.maxMint >= armour.mint){
							if (player.mint >= armour.mint){
								helper.buyArmour(player, armour, function(){
									pageData.successMsg += "You purchased the "+armour.name+"! ";
									viewPlay(req, res, pageData);
								});
							} else {
								pageData.errorMsg += "You can't afford the "+armour.name+"! ";
								viewPlay(req, res, pageData);
							}
						} else {
							viewPlay(req, res, pageData);
						}
					} else {
						viewPlay(req, res, pageData);
					}
				} else if (locationType == 'shrine'){
					if (postBody.shrineHeal){
						helper.getPlayerMaxHealth(player, function(maxHealth){
							healTo = maxHealth;
							if (location.factionId != null){
								// Player heals up to their fame value for the shrines faction
								for (var i = 0; i < player.fame.length; i++){
									var pFame = player.fame[i];
									if (pFame.factionId == location.factionId){
										if (pFame < healTo){
											healTo = pFrame;
										}
										break;
									}
								}
							}
							pageData.successMsg += 'Your body has been healed! ';
							player.health = healTo;
							helper.updatePlayerHealth(player, function(){
								viewPlay(req, res, pageData);
							});
						});
					} else {
						viewPlay(req, res, pageData);
					}
				} else if (locationType == 'entrance'){
					if (postBody.enterEntrance){
						player.locationX = location.location2X;
						player.locationY = location.location2Y;
						player.mapId = location.map2Id;
						helper.movePlayerDB(player.playerId, player.mapId, player.locationX, player.locationY, function(){
							pageData.map = helper.getMapFromPlayer(player);
							viewPlay(req, res, pageData);
						});
					} else {
						viewPlay(req, res, pageData);
					}
				} else {
					viewPlay(req, res, pageData);
				}
			});
		}
	});
});

attackEnemy = function(player, weapon, enemy, hand, combatLog){
	if (weapon == null){
		// No weapon, use hand
		enemy.health -= 1;
		combatLog.push('Your ' + hand + ' hand did 1 damage!');
	} else {
		var hit = helper.skillCheck(weapon.skill / 2);
		if (hit){
			var dmg = Math.round(helper.getRandomInt(weapon.skill, 100) * weapon.damage / 100);
			//TODO enemy factionId check
			enemy.health -= dmg;
			combatLog.push('Your ' + weapon.name + ' did ' + dmg + ' damage!');
		} else {
			combatLog.push('Your ' + weapon.name + ' missed!');
		}
		// Skill check regardless of hit/miss, only if enemy not dead
		if (enemy.health > 0 && helper.skillCheck(200 - weapon.skill)){
			// Player skills up
			weapon.skill++;
			helper.updateWeaponSkill(player, weapon);
			combatLog.push('Your skill with ' + weapon.name + ' increased!');
		}
	}
	if (enemy.health <= 0){
		combatLog.push(enemy.name + ' was killed!');
	}
}

attackPlayer = function(player, weapon, attackedPlayer, hand, combatLog){
	if (weapon == null){
		// No weapon, use hand
		attackedPlayer.health -= 1;
		combatLog.push(player.name + '\'s ' + hand + ' hand did 1 damage to ' + attackedPlayer.name + '!');
	} else {
		var armour = attackedPlayer.equipBody;
		var hit = helper.skillCheck(weapon.skill / 2);
		if (hit){
			var dmg = Math.round(helper.getRandomInt(weapon.skill, 100) * weapon.damage / 100);
			if (armour != null){
				dmg -= Math.round(helper.getRandomInt(armour.skill, 100) * armour.blocks / 100);
				//TODO incorporate faction bonuses
			}
			if (dmg < 0){
				dmg = 0;
			}
			attackedPlayer.health -= dmg;
			combatLog.push(player.name + '\'s ' + weapon.name + ' did ' + dmg + ' damage to ' + attackedPlayer.name + '!');
		} else {
			combatLog.push(player.name + '\'s ' + weapon.name + ' missed!');
		}
		// Skill check regardless of hit/miss, only if attackedPlayer not dead
		if (attackedPlayer.health > 0 && helper.skillCheck(200 - weapon.skill)){
			// Player skills up
			weapon.skill++;
			helper.updateWeaponSkill(player, weapon);
			combatLog.push(player.name + '\'s skill with ' + weapon.name + ' increased!');
		}
		// Skill check armour if worn and hit and alive
		if (armour != null && hit && attackedPlayer.health > 0 && helper.skillCheck(200 - armour.skill)){
			// attackedPlayer skills up
			armour.skill++;
			helper.updateArmourSkill(attackedPlayer, armour);
			combatLog.push(attackedPlayer.name + '\'s skill with ' + armour.name + ' increased!');
		}
	}
	if (attackedPlayer.health <= 0){
		combatLog.push(attackedPlayer.name + ' was killed!');
	}
}


module.exports = router;
