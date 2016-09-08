var async = require('async');
var log = require('winston');
var db = require('./db');
var gameData = require('./gameData');

/* Generates a random integer between min and max, inclusive */
module.exports.getRandomInt = function(min, max) {
	if (min > max){
		var temp = min;
		min = max;
		max = temp;
	}
	max += 1;
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

/* Randomly passes or fails a skill check with passChance probability */
module.exports.skillCheck = function(passChance) {
	var passCheck = module.exports.getRandomInt(0, 100);
	// A pass occurs when the roll is lower than the pass chance
	var pass = passCheck <= passChance;
	log.debug('Skill check at rate '+passChance+' ' + (pass?'passed':'failed') + ' with ' + passCheck);
	return pass;
}

module.exports.playerStartingMint = 300;

/* Returns the player for the given user */
module.exports.getPlayer = function(userId, next){
	db.runSqlSingleResult('SELECT playerId, name, raceId, health, mint, mapId, locationX, locationY, lastAction FROM player WHERE userId = ?', [userId], function(dbPlayer){
		if (dbPlayer != null){
			dbPlayer.race = gameData.races[dbPlayer.raceId -1];
			async.series([
				function(callback){
					// Update inventory
					module.exports.updatePlayerInventory(dbPlayer, callback);
				}, function(callback){
					// Update player max health
					module.exports.getPlayerMaxHealth(dbPlayer, function(){
						callback();
					});
				}, function(callback){
					// Update player faction fame
					module.exports.getPlayerFactionFame(dbPlayer, function(){
						callback();
					});
				}], function(){
					log.debug("Player for user ("+userId+"): " + JSON.stringify(dbPlayer, null, 2));
					if (next){
						next(dbPlayer);
					}
				});
		} else {
			next(null);
		}
	});
};

module.exports.getPlayerWeapons = function(playerId, next){
	db.runSql('SELECT playerWeaponId, weapon.weaponId, damage, name, equipLeft, equipRight, skill FROM player_weapon INNER JOIN weapon ON weapon.weaponId = player_weapon.weaponId INNER JOIN player_weapon_skill ON weapon.weaponId = player_weapon_skill.weaponId WHERE player_weapon.playerId = ?', [playerId], next);
};
module.exports.getPlayerArmours = function(playerId, next){
	db.runSql('SELECT playerArmourId, armour.armourId, blocks, name, equip, skill FROM player_armour INNER JOIN armour ON armour.armourId = player_armour.armourId INNER JOIN player_armour_skill ON armour.armourId = player_armour_skill.armourId WHERE player_armour.playerId = ?', [playerId], next);
};
module.exports.updatePlayerInventory = function(player, next){
	async.parallel([
		function(callback){
			module.exports.getPlayerWeapons(player.playerId, function(dbPlayerWeapons){
				player.weapons = dbPlayerWeapons;
				player.equipLeft = null;
				player.equipRight = null;
				for (var i = 0; i < player.weapons.length; i++){
					var item = player.weapons[i];
					if (item.equipLeft){
						player.equipLeft = item;
					} else if (item.equipRight){
						player.equipRight = item;
					}
				}
				callback();
			});
		}, function(callback){
			module.exports.getPlayerArmours(player.playerId, function(dbPlayerArmours){
				player.armours = dbPlayerArmours;
				player.equipBody = null;
				for (var i = 0; i < player.armours.length; i++){
					var item = player.armours[i];
					if (item.equip){
						player.equipBody = item;
					}
				}
				callback();
			});
		}], function(){
			next();
		});
};

/* Equip and unequip weapons and armour */
module.exports.unequipWeapon = function(player, left, next){
	db.runSql('UPDATE player_weapon SET ?? = false WHERE playerId = ?', [left ? 'equipLeft' : 'equipRight', player.playerId], function(){
		// Update players inventory
		module.exports.updatePlayerInventory(player, next);
	});
};
module.exports.equipWeapon = function(player, left, playerWeaponId, next){
	module.exports.unequipWeapon(player, left, function(){
		db.runSql('UPDATE player_weapon SET ?? = true, ?? = false WHERE playerId = ? AND playerWeaponId = ?', [left ? 'equipLeft' : 'equipRight', left ? 'equipRight' : 'equipLeft', player.playerId, playerWeaponId], function(){
			// Update players inventory
			module.exports.updatePlayerInventory(player, next);
		});
	});
};
module.exports.unequipArmour = function(player, next){
	db.runSql('UPDATE player_armour SET equip = false WHERE playerId = ?', [player.playerId], function(){
		// Update players inventory
		module.exports.updatePlayerInventory(player, function(){
			// Update players max health
			module.exports.getPlayerMaxHealth(player, next);
		});
	});
};
module.exports.equipArmour = function(player, playerArmourId, next){
	module.exports.unequipArmour(player, function(){
		db.runSql('UPDATE player_armour SET equip = true WHERE playerId = ? AND playerArmourId = ?', [player.playerId, playerArmourId], function(){
			// Update players inventory
			module.exports.updatePlayerInventory(player, function(){
				// Update players max health
				module.exports.getPlayerMaxHealth(player, next);
			});
		});
	});
};

/* Updates the skill of the player for the given weapon */
module.exports.updateWeaponSkill = function(player, weapon, next){
	db.runSql('UPDATE player_weapon_skill SET skill = ? WHERE playerId = ? AND weaponId = ?', [weapon.skill, player.playerId, weapon.weaponId], function(){
		if (next){
			next();
		}
	});
};

/* Updates the skill of the player for the given armour */
module.exports.updateArmourSkill = function(player, armour, next){
	db.runSql('UPDATE player_armour_skill SET skill = ? WHERE playerId = ? AND armourId = ?', [armour.skill, player.playerId, armour.armourId], function(){
		if (next){
			next();
		}
	});
};

module.exports.updatePlayer = function(player, next){
	db.runSql('UPDATE player SET mint = ?, health = ?, lastAction = NOW() WHERE playerId = ?', [player.mint, player.health, player.playerId], function(result){
		if (next){
			next();
		}
	});
};

module.exports.updatePlayerMint = function(player, next){
	db.runSql('UPDATE player SET mint = ?, lastAction = NOW() WHERE playerId = ?', [player.mint, player.playerId], function(result){
		if (next){
			next();
		}
	});
};

module.exports.updatePlayerHealth = function(player, next){
	db.runSql('UPDATE player SET health = ?, lastAction = NOW() WHERE playerId = ?', [player.health, player.playerId], function(result){
		if (next){
			next();
		}
	});
};

module.exports.killPlayer = function(player, next){
	player.mint = 0;
	player.health = 0;
	updatePlayer(next);
}

module.exports.playerDefaultMaxHealth = 10;

module.exports.getPlayerMaxHealth = function(player, next){
	var maxHealth = module.exports.playerDefaultMaxHealth;
	if (player.equipBody){
		maxHealth = player.equipBody.blocks * 2;
	}
	player.maxHealth = maxHealth;
	if (player.health > player.maxHealth){
		// Reduce players health to maxHealth
		player.health = player.maxHealth;
	}
	next(maxHealth);
};

module.exports.getPlayerFactionFame = function(player, next){
	db.runSql('SELECT factionId, fame FROM player_faction WHERE playerId = ?', [player.playerId], function(results){
		log.debug('Player faction fame: '+JSON.stringify(results, null, 2));
		player.fame = results;
		next(results);
	});
};

module.exports.movePlayer = function(player, move, next){
	var map = module.exports.getMapFromPlayer(player);
	var moved = false;
	var errorMsg = '';
	if (move == 'north'){
		// Move north, test height
		if (map.height > player.locationY + 1){
			player.locationY += 1;
			moved = true;
		} else {
			errorMsg += "You can't go any further that way! ";
		}
	} else if (move == 'south'){
		// Move south, test 0
		if (0 <= player.locationY - 1){
			player.locationY -= 1;
			moved = true;
		} else {
			errorMsg += "You can't go any further that way! ";
		}
	} else if (move == 'east'){
		// Move east, test width
		if (map.width > player.locationX + 1){
			player.locationX += 1;
			moved = true;
		} else {
			errorMsg += "You can't go any further that way! ";
		}
	} else if (move == 'west'){
		// Move west, test 0
		if (0 <= player.locationX - 1){
			player.locationX -= 1;
			moved = true;
		} else {
			errorMsg += "You can't go any further that way! ";
		}
	} else {
		// Move value not supported. 
		errorMsg += 'Move direction invalid. ';
	}
	if (moved){
		module.exports.movePlayerDB(player.playerId, player.mapId, player.locationX, player.locationY, function(){
			next('', true);
		});
	} else {
		next(errorMsg, false);
	}
};

/* Moves the player to the given position */
module.exports.movePlayerDB = function(playerId, mapId, locationX, locationY, next){
	db.runSql('UPDATE player SET mapId = ?, locationX = ?, locationY = ?, lastAction = NOW() WHERE playerId = ?', [mapId, locationX, locationY, playerId], function(result){
		if (next){
			next();
		}
	});
};

/* Get map from player */
module.exports.getMapFromPlayer = function(player){
	return gameData.maps[player.mapId - 1];
};

module.exports.getPlayersAt = function(mapId, locationX, locationY, next){
	db.runSql('SELECT playerId, name FROM player WHERE mapId = ? AND locationX = ? AND locationY = ? AND lastAction > ADDDATE(NOW(), INTERVAL -1 HOUR)', [mapId, locationX, locationY], next);
};

module.exports.getPlayersAtPlayer = function(player, next){
	module.exports.getPlayersAt(player.mapId, player.locationX, player.locationY, function(dbPlayers){
		// Remove current player from list
		for (var i = 0; i < dbPlayers.length; i++){
			if (dbPlayers[i].playerId == player.playerId){
				dbPlayers.splice(i, 1);
				break;
			}
		}
		next(dbPlayers);
	});
};

module.exports.getEnemiesAtMap = function(mapId, next){
	var map = gameData.maps[mapId - 1];
	if (map.enemies){
		// Map has enemies loaded, use them
		next(map.enemies);
	} else {
		// Load maps enemies then use them
		gameData.updateMap(mapId, function(map){
			next(map.enemies);
		});
	}
};

module.exports.getLocationAtPlayer = function(player, next){
	var map = module.exports.getMapFromPlayer(player);
	if (map.loaded){
		findLocation(map, player.locationX, player.locationY, next);
	} else {
		gameData.updateMap(map.mapId, function(map){
			findLocation(map, player.locationX, player.locationY, next);
		});
	}
};

findLocation = function(map, locationX, locationY, next){
	// Check for store
	if (map.stores){
		for (var i = 0; i < map.stores.length; i++){
			var store = map.stores[i];
			if (store.locationX == locationX && store.locationY == locationY){
				next(store, 'store');
				return;
			}
		}
	}
	// Check for entrance
	if (map.entrances){
		for (var i = 0; i < map.entrances.length; i++){
			var entrance = map.entrances[i];
			if (entrance.locationX == locationX && entrance.locationY == locationY){
				next(entrance, 'entrance');
				return;
			}
		}
	}
	// Check for shrines
	if (map.shrines){
		for (var i = 0; i < map.shrines.length; i++){
			var shrine = map.shrines[i];
			if (shrine.locationX == locationX && shrine.locationY == locationY){
				next(shrine, 'shrine');
				return;
			}
		}
	}
	// Check for signposts
	if (map.signposts){
		for (var i = 0; i < map.signposts.length; i++){
			var signpost = map.signposts[i];
			if (signpost.locationX == locationX && signpost.locationY == locationY){
				next(signpost, 'signpost');
				return;
			}
		}
	}
	// Nothing found
	next(null, null);
};

module.exports.buyWeapon = function(player, weapon, next){
	// Add to player inventory
	db.runSql('INSERT INTO player_weapon (playerId, weaponId) VALUES (?, ?)', [player.playerId, weapon.weaponId], function(result){
		// Update inventory
		module.exports.updatePlayerInventory(player, function(){
			// Update player mint
			player.mint -= weapon.mint;
			module.exports.updatePlayerMint(player, function(){
				// Check player has a skill
				db.runSqlSingleResult('SELECT playerWeaponSkillId FROM player_weapon_skill WHERE playerId = ? AND weaponId = ?', [player.playerId, weapon.weaponId], function(result){
					if (result == null){
						// Add skill with base stats
						db.runSql('INSERT INTO player_weapon_skill (playerId, weaponId, skill) SELECT ?, ?, fame FROM race_faction_default WHERE raceId = ? AND factionId = ?', [player.playerId, weapon.weaponId, player.raceId, weapon.factionId], function(result){
							next();
						});
					} else {
						next();
					}
				});
			});
		});
	});
};

module.exports.buyArmour = function(player, armour, next){
	// Add to player inventory
	db.runSql('INSERT INTO player_armour (playerId, armourId) VALUES (?, ?)', [player.playerId, armour.armourId], function(result){
		// Update inventory
		module.exports.updatePlayerInventory(player, function(){
			// Update player mint
			player.mint -= armour.mint;
			module.exports.updatePlayerMint(player, function(){
				// Check player has a skill
				db.runSqlSingleResult('SELECT playerArmourSkillId FROM player_armour_skill WHERE playerId = ? AND armourId = ?', [player.playerId, armour.armourId], function(result){
					if (result == null){
						// Add skill with base stats
						db.runSql('INSERT INTO player_armour_skill (playerId, armourId, skill) SELECT ?, ?, fame FROM race_faction_default WHERE raceId = ? AND factionId = ?', [player.playerId, armour.armourId, player.raceId, armour.factionId], function(result){
							next();
						});
					} else {
						next();
					}
				});
			});
		});
	});
};

















