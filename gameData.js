/* Get static look up values */
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
	db.runSql('SELECT factionId, name, description, startingMapId FROM faction', [], function(dbFactions){
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

module.exports.updateMapLocations = function(mapId, next){
	db.runSql('SELECT locationId, x, y, locationType FROM location WHERE mapId = ?', [mapId], function(dbLocations){
		module.exports.maps.forEach(function(map){
			if (map.mapId == mapId){
				map.locations = dbLocations;
			}
		});
		console.log("Locations for map("+mapId+"): " + JSON.stringify(dbLocations, null, 2));
		if (next){
			next(dbLocations);
		}
	});
};

module.exports.updateRaceFactionDefaults = function(next){
	db.runSql('SELECT raceFactionDefaultId, raceId, factionId, fame FROM raceFactionDefault', [], function(dbRaceFactionDefaults){
		module.exports.raceFactionDefaults = dbRaceFactionDefaults;
		console.log("Race Faction Defaults: " + JSON.stringify(dbRaceFactionDefaults, null, 2));
		if (next){
			next(dbRaceFactionDefaults);
		}
	});
};