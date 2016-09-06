/* Get static look up values */
var async = require('async');

var db = require('./db');

module.exports.updateRaces = function(next){
	db.runSql('SELECT raceId, name, description FROM race', [], function(dbRaces){
		module.exports.races = dbRaces;
		console.log("Races: " + JSON.stringify(dbRaces, null, 2));
		if (next){
			next(dbRaces);
		}
	});
};
module.exports.updateRaces();

module.exports.updateFactions = function(next){
	db.runSql('SELECT factionId, name, description FROM faction', [], function(dbFactions){
		module.exports.factions = dbFactions;
		console.log("Factions: " + JSON.stringify(dbFactions, null, 2));
		if (next){
			next(dbFactions);
		}
	});
};
module.exports.updateFactions();

module.exports.updateMaps = function(next){
	db.runSql('SELECT mapId, name, description, height, width, pvp FROM map', [], function(dbMaps){
		module.exports.maps = dbMaps;
		console.log("Maps: " + JSON.stringify(dbMaps, null, 2));
		if (next){
			next(dbMaps);
		}
	});
};
module.exports.updateMaps();

module.exports.updateMap = function(mapId, next){
	var map = null;
	module.exports.maps.forEach(function(loopMap){
		if (loopMap.mapId == mapId){
			map = loopMap;
		}
	});
	async.parallel([
		function(callback){
			// Get stores
			db.runSql('SELECT storeId, locationX, locationY, name, factionId, sellsWeapons, sellsArmour, maxMint FROM store WHERE mapId = ?', [mapId], function(dbStores){
				map.stores = dbStores;
				console.log("Stores for map("+mapId+"): " + JSON.stringify(dbStores, null, 2));
				callback();
			});
		}, function(callback){
			// Get entrances
			db.runSql('SELECT entranceId, locationX, locationY, map2Id, location2X, location2Y, factionId, fame FROM entrance WHERE mapId = ?', [mapId], function(dbEntrances){
				map.entrances = dbEntrances;
				console.log("Entrances for map("+mapId+"): " + JSON.stringify(dbEntrances, null, 2));
				callback();
			});
		}, function(callback){
			// Get shrines
			db.runSql('SELECT shrineId, locationX, locationY, factionId FROM shrine WHERE mapId = ?', [mapId], function(dbShrines){
				map.shrines = dbShrines;
				console.log("Shrines for map("+mapId+"): " + JSON.stringify(dbShrines, null, 2));
				callback();
			});
		}, function(callback){
			// Get enemies
			db.runSql('SELECT enemyId, name FROM enemy WHERE mapId = ?', [mapId], function(dbEnemies){
				map.enemies = dbEnemies;
				console.log("Enemies for map("+mapId+"): " + JSON.stringify(dbEnemies, null, 2));
				callback();
			});
		}
		], function(){
			map.loaded = true;
			if (next){
				next(map);
			}
		}
	);
};

module.exports.updateRaceFactionDefaults = function(next){
	db.runSql('SELECT raceFactionDefaultId, raceId, factionId, fame FROM race_faction_default', [], function(dbRaceFactionDefaults){
		module.exports.raceFactionDefaults = dbRaceFactionDefaults;
		console.log("Race Faction Defaults: " + JSON.stringify(dbRaceFactionDefaults, null, 2));
		if (next){
			next(dbRaceFactionDefaults);
		}
	});
};
module.exports.updateRaceFactionDefaults();

module.exports.updateWeapons = function(next){
	db.runSql('SELECT weaponId, name, factionId, damage, mint FROM weapon', [], function(dbWeapons){
		module.exports.weapons = dbWeapons;
		console.log("Weapons: " + JSON.stringify(dbWeapons, null, 2));
		if (next){
			next(dbWeapons);
		}
	});
};
module.exports.updateWeapons();

module.exports.updateArmours = function(next){
	db.runSql('SELECT armourId, name, factionId, blocks, mint FROM armour', [], function(dbArmours){
		module.exports.armours = dbArmours;
		console.log("Armours: " + JSON.stringify(dbArmours, null, 2));
		if (next){
			next(dbArmours);
		}
	});
};
module.exports.updateArmours();