-- Create database
CREATE database IF NOT EXISTS polemiosDB;

USE polemiosDB;

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
	description varchar(200) NOT NULL,
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
    description varchar(200),
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
	PRIMARY KEY (storeId),
	FOREIGN KEY (mapId) REFERENCES map (mapId),
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
