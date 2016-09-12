-- Create database
CREATE DATABASE IF NOT EXISTS polemiosDB;

USE polemiosDB;

-- Create version table
CREATE TABLE IF NOT EXISTS database_version (
	version INTEGER UNIQUE NOT NULL,
	updated DATETIME DEFAULT NOW()
)engine=innodb;


-- Create user table
CREATE TABLE IF NOT EXISTS polemios_user (
	userId INTEGER AUTO_INCREMENT,
	username varchar(30) UNIQUE NOT NULL,
	email varchar(200) NOT NULL,
	password char(128) NOT NULL,
	salt char(128) NOT NULL,
	PRIMARY KEY (userId)
)engine=innodb;


-- --------Race/Factions

-- Create race lookup table
CREATE TABLE IF NOT EXISTS race (
	raceId INTEGER NOT NULL, 
    name varchar(30) UNIQUE NOT NULL,
	description varchar(350) NOT NULL,
	PRIMARY KEY (raceId)
)engine=innodb;

-- Create faction lookup table
CREATE TABLE IF NOT EXISTS faction (
	factionId INTEGER NOT NULL, 
    name varchar(30) NOT NULL,
	description varchar(200) NOT NULL,
	PRIMARY KEY (factionId)
)engine=innodb;

-- Create race faction default fame table
CREATE TABLE IF NOT EXISTS race_faction_default (
	raceFactionDefaultId INTEGER AUTO_INCREMENT, 
    raceId INTEGER NOT NULL,
    factionId INTEGER NOT NULL,
	fame INTEGER NOT NULL,
	PRIMARY KEY (raceFactionDefaultId),
	FOREIGN KEY (raceId) REFERENCES race (raceId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- --------Map/Locations

-- Create map table
CREATE TABLE IF NOT EXISTS map (
	mapId INTEGER NOT NULL,
    name varchar(30) UNIQUE NOT NULL,
    description varchar(300),
    height INTEGER NOT NULL,
    width INTEGER NOT NULL,
	pvp BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY (mapId)
)engine=innodb;

-- Create store table
CREATE TABLE IF NOT EXISTS store (
	storeId INTEGER AUTO_INCREMENT,
    name varchar(30) UNIQUE NOT NULL,
    mapId INTEGER NOT NULL,
    locationX INTEGER NOT NULL,
    locationY INTEGER NOT NULL,
    factionId INTEGER,
	sellsWeapons BOOLEAN NOT NULL,
	sellsArmour BOOLEAN NOT NULL,
	maxMint INTEGER NOT NULL,
	PRIMARY KEY (storeId),
	FOREIGN KEY (mapId) REFERENCES map (mapId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- Create shrine table
CREATE TABLE IF NOT EXISTS shrine (
	shrineId INTEGER AUTO_INCREMENT,
    name varchar(30) UNIQUE NOT NULL,
    mapId INTEGER NOT NULL,
    locationX INTEGER NOT NULL,
    locationY INTEGER NOT NULL,
    factionId INTEGER,
	PRIMARY KEY (shrineId),
	FOREIGN KEY (mapId) REFERENCES map (mapId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- Create sign post table
CREATE TABLE IF NOT EXISTS signpost (
	signpostId INTEGER AUTO_INCREMENT,
    description TEXT NOT NULL,
    mapId INTEGER NOT NULL,
    locationX INTEGER NOT NULL,
    locationY INTEGER NOT NULL,
	PRIMARY KEY (signpostId),
	FOREIGN KEY (mapId) REFERENCES map (mapId)
)engine=innodb;

-- Create map change table
CREATE TABLE IF NOT EXISTS entrance (
	entranceId INTEGER AUTO_INCREMENT,
    mapId INTEGER NOT NULL,
    locationX INTEGER NOT NULL,
    locationY INTEGER NOT NULL,
    map2Id INTEGER NOT NULL,
    location2X INTEGER NOT NULL,
    location2Y INTEGER NOT NULL,
    factionId INTEGER,
	fame INTEGER,
	PRIMARY KEY (entranceId),
	FOREIGN KEY (mapId) REFERENCES map (mapId),
	FOREIGN KEY (map2Id) REFERENCES map (mapId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;


-- --------Items

-- Create weapon table
CREATE TABLE IF NOT EXISTS weapon (
	weaponId INTEGER AUTO_INCREMENT, 
    name varchar(30) UNIQUE NOT NULL,
    factionId INTEGER NOT NULL,
	damage INTEGER NOT NULL,
	mint INTEGER NOT NULL,
	PRIMARY KEY (weaponId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- Create armour table
CREATE TABLE IF NOT EXISTS armour (
	armourId INTEGER AUTO_INCREMENT, 
    name varchar(30) UNIQUE NOT NULL,
    factionId INTEGER NOT NULL,
	blocks INTEGER NOT NULL,
	mint INTEGER NOT NULL,
	PRIMARY KEY (armourId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;


-- --------Enemy

-- Create enemy table
CREATE TABLE IF NOT EXISTS enemy (
	enemyId INTEGER AUTO_INCREMENT, 
    name varchar(30) UNIQUE NOT NULL,
    factionId INTEGER,
	damage INTEGER NOT NULL,
	health INTEGER NOT NULL,
	mint INTEGER NOT NULL,
	mapId INTEGER NOT NULL,
	PRIMARY KEY (enemyId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId),
	FOREIGN KEY (mapId) REFERENCES map (mapId)
)engine=innodb;


-- --------Player

-- Create player table
CREATE TABLE IF NOT EXISTS player (
	playerId INTEGER AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    name varchar(30) UNIQUE NOT NULL,
    raceId INTEGER NOT NULL,
    health INTEGER DEFAULT 0,
    mint INTEGER DEFAULT 0,
	mapId INTEGER,
	locationX INTEGER DEFAULT 0,
	locationY INTEGER DEFAULT 0,
	lastAction DATETIME DEFAULT NOW(),
	PRIMARY KEY (playerId),
	FOREIGN KEY (userId) REFERENCES polemios_user (userId),
	FOREIGN KEY (raceId) REFERENCES race (raceId),
	FOREIGN KEY (mapId) REFERENCES map (mapId)
)engine=innodb;

-- Create player stats table
CREATE TABLE IF NOT EXISTS player_stats (
	playerStatsId INTEGER AUTO_INCREMENT,
    playerId INTEGER NOT NULL,
	alignment INTEGER DEFAULT 0,
	deaths INTEGER DEFAULT 0,
	PRIMARY KEY (playerStatsId),
	FOREIGN KEY (playerId) REFERENCES player (playerId)
)engine=innodb;

-- Create player faction table
CREATE TABLE IF NOT EXISTS player_faction (
	playerFactionId INTEGER AUTO_INCREMENT, 
    playerId INTEGER,
    factionId INTEGER,
	fame INTEGER NOT NULL,
	PRIMARY KEY (playerFactionId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- Create player weapon table
CREATE TABLE IF NOT EXISTS player_weapon (
	playerWeaponId INTEGER AUTO_INCREMENT, 
    playerId INTEGER NOT NULL,
    weaponId INTEGER NOT NULL,
	equipLeft BOOLEAN NOT NULL DEFAULT FALSE,
	equipRight BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (playerWeaponId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (weaponId) REFERENCES weapon (weaponId)
)engine=innodb;

-- Create player armour table
CREATE TABLE IF NOT EXISTS player_armour (
	playerArmourId INTEGER AUTO_INCREMENT, 
    playerId INTEGER NOT NULL,
    armourId INTEGER NOT NULL,
	equip BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (playerArmourId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (armourId) REFERENCES armour (armourId)
)engine=innodb;

-- Create player weapon skill table
CREATE TABLE IF NOT EXISTS player_weapon_skill (
	playerWeaponSkillId INTEGER AUTO_INCREMENT, 
    playerId INTEGER NOT NULL,
    weaponId INTEGER NOT NULL,
	skill INTEGER NOT NULL,
	PRIMARY KEY (playerWeaponSkillId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (weaponId) REFERENCES weapon (weaponId)
)engine=innodb;

-- Create player armour skill table
CREATE TABLE IF NOT EXISTS player_armour_skill (
	playerArmourSkillId INTEGER AUTO_INCREMENT, 
    playerId INTEGER NOT NULL,
    armourId INTEGER NOT NULL,
	skill INTEGER NOT NULL,
	PRIMARY KEY (playerArmourSkillId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (armourId) REFERENCES armour (armourId)
)engine=innodb;