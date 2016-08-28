/* Get static look up values */
var db = require('./db');

module.exports.updateRaces = function(){
	db.runSql('SELECT raceId, name, description FROM race', [], function(dbRaces){
		module.exports.races = dbRaces;
		console.log("Races: " + JSON.stringify(dbRaces, null, 2));
	});
};
module.exports.updateRaces();

module.exports.updateFactions = function(){
	db.runSql('SELECT factionId, name, description FROM faction', [], function(dbFactions){
		module.exports.factions = dbFactions;
		console.log("Factions: " + JSON.stringify(dbFactions, null, 2));
	});
};
module.exports.updateFactions();

module.exports.updateMaps = function(){
	db.runSql('SELECT mapId, name, description, height, width, pvp FROM map', [], function(dbMaps){
		module.exports.maps = dbMaps;
		console.log("Maps: " + JSON.stringify(dbMaps, null, 2));
	});
};
module.exports.updateMaps();

module.exports.updateMapLocations = function(mapId){
	db.runSql('SELECT locationId, x, y, locationType FROM location WHERE mapId = ?', [mapId], function(dbLocations){
		module.exports.maps.forEach(function(map){
			if (map.mapId == mapId){
				map.locations = dbLocations;
			}
		});
		console.log("Locations for map("+mapId+"): " + JSON.stringify(dbLocations, null, 2));
	});
}