/* Get static look up values */
var db = require('./db');
var gameData = require('./gameData');

/* Returns the player for the given user */
module.exports.getPlayer = function(userId, next){
	db.runSqlSingleResult('SELECT playerId, name, raceId, health, mapId, locationX, locationY, lastAction FROM player WHERE userId = ?', [userId], function(dbPlayer){
		if (dbPlayer != null){
			dbPlayer.race = gameData.races[dbPlayer.raceId -1];	
		}
		console.log("Player for user ("+userId+"): " + JSON.stringify(dbPlayer, null, 2));
		if (next){
			next(dbPlayer);
		}
	});
};

/* Updates the players lastAction */
module.exports.updatePlayer = function(playerId, next){
	db.runSql('UPDATE player SET lastAction = NOW() WHERE playerId = ?', [playerId], function(result){
		if (next){
			next();
		}
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
}

/* Get map from player */
module.exports.getMapFromPlayer = function(player){
	return gameData.maps[player.mapId - 1];
}

module.exports.getPlayersAt = function(mapId, locationX, locationY, next){
	//TODO check lastAction for inactivity safety
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
}