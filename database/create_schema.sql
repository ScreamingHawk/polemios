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
	raceId INTEGER, 
    name varchar(30),
	description varchar(200),
	PRIMARY KEY (raceId)
)engine=innodb;

-- Add race data
-- TODO Better description
INSERT INTO race (raceId, name, description) VALUES (1, 'Human', 'Humans');
INSERT INTO race (raceId, name, description) VALUES (2, 'Kobold', 'Kobolds');
INSERT INTO race (raceId, name, description) VALUES (3, 'Ethereal', 'Ethereal');
INSERT INTO race (raceId, name, description) VALUES (4, 'Orc', 'Orcs');
INSERT INTO race (raceId, name, description) VALUES (5, 'Slime', 'Slimes');
INSERT INTO race (raceId, name, description) VALUES (6, 'Golem', 'Golems');

-- Create faction lookup table
CREATE TABLE IF NOT EXISTS faction (
	factionId INTEGER, 
    name varchar(30),
	description varchar(200),
	PRIMARY KEY (factionId)
)engine=innodb;

-- Add faction data
-- TODO Better description
INSERT INTO faction (factionId, name, description) VALUES (1, 'Glow', 'The magic faction');
INSERT INTO faction (factionId, name, description) VALUES (2, 'Flame', 'The steam faction');
INSERT INTO faction (factionId, name, description) VALUES (3, 'Lightning', 'The electricity faction');

-- Create race faction default fame table
CREATE TABLE IF NOT EXISTS race_faction_default (
	raceFactionDefaultId INTEGER AUTO_INCREMENT, 
    raceId INTEGER,
    factionId INTEGER,
	fame INTEGER NOT NULL,
	PRIMARY KEY (raceFactionDefaultId),
	FOREIGN KEY (raceId) REFERENCES race (raceId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;

-- Add race faction default data
-- TODO Fix fame scale
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 1, 50); -- Human Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 2, 25); -- Human Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 3, 75); -- Human Lightning
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 1, 25); -- Kobold Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 2, 75); -- Kobold Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 3, 50); -- Kobold Lightning
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 1, 75); -- Ethereal Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 2, 50); -- Ethereal Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 3, 25); -- Ethereal Lightning
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 1, 25); -- Orc Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 2, 100); -- Orc Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 3, 25); -- Orc Lightning
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 1, 100); -- Slime Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 2, 25); -- Slime Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 3, 25); -- Slime Lightning
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 1, 25); -- Golem Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 2, 25); -- Golem Flame
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 3, 100); -- Golem Lightning


-- --------Map/Locations

-- Create map table
CREATE TABLE IF NOT EXISTS map (
	mapId INTEGER AUTO_INCREMENT,
    name varchar(30) UNIQUE NOT NULL,
    description varchar(200),
    height INTEGER,
    width INTEGER,
	PRIMARY KEY (mapId)
)engine=innodb;

-- Create location table
CREATE TABLE IF NOT EXISTS location (
	locationId INTEGER AUTO_INCREMENT,
    mapId INTEGER,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    locationType varchar(10), -- TODO Should locationType be a lookup?
	PRIMARY KEY (locationId),
	FOREIGN KEY (mapId) REFERENCES map (mapId)
)engine=innodb;


-- --------Player

-- Create player table
CREATE TABLE IF NOT EXISTS player (
	playerId INTEGER AUTO_INCREMENT,
    userId INTEGER,
    name varchar(30) UNIQUE NOT NULL,
    raceId INTEGER,
    health INTEGER,
	mapId INTEGER,
	locationX INTEGER,
	locationY INTEGER,
	PRIMARY KEY (playerId),
	FOREIGN KEY (userId) REFERENCES polemios_user (userId),
	FOREIGN KEY (raceId) REFERENCES race (raceId),
	FOREIGN KEY (mapId) REFERENCES map (mapId)
)engine=innodb;

-- Create player stats table
CREATE TABLE IF NOT EXISTS player_stats (
	playerStatsId INTEGER AUTO_INCREMENT,
    playerId INTEGER,
	alignment INTEGER,
	deaths INTEGER,
	fame INTEGER,
	PRIMARY KEY (playerStatsId),
	FOREIGN KEY (playerId) REFERENCES player (playerId)
)engine=innodb;


-- Create player faction table
CREATE TABLE IF NOT EXISTS player_faction_default (
	playerFactionDefaultId INTEGER AUTO_INCREMENT, 
    playerId INTEGER,
    factionId INTEGER,
	fame INTEGER NOT NULL,
	PRIMARY KEY (playerFactionDefaultId),
	FOREIGN KEY (playerId) REFERENCES player (playerId),
	FOREIGN KEY (factionId) REFERENCES faction (factionId)
)engine=innodb;