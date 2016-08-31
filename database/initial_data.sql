USE polemiosDB;

-- Add maps and location data
-- TODO Better descriptions
-- TODO Remove test locations
INSERT INTO map (mapId, name, height, width, pvp, description) VALUES (1, 'The Docks', 3, 5, false, 'The first stop for new adventurers. ');
INSERT INTO map (mapId, name, height, width, pvp, description) VALUES (2, 'The Wilderness', 5, 5, true, 'The last stop for unprepared adventurers. ');

-- Add race data
-- TODO Better description
INSERT INTO race (raceId, name, description) VALUES (1, 'Human', 'Humans');
INSERT INTO race (raceId, name, description) VALUES (2, 'Kobold', 'Kobolds');
INSERT INTO race (raceId, name, description) VALUES (3, 'Ethereal', 'Ethereal');
INSERT INTO race (raceId, name, description) VALUES (4, 'Orc', 'Orcs');
INSERT INTO race (raceId, name, description) VALUES (5, 'Slime', 'Slimes');
INSERT INTO race (raceId, name, description) VALUES (6, 'Golem', 'Golems');

-- Add faction data
-- TODO Better description
INSERT INTO faction (factionId, name, description) VALUES (1, 'Glow', 'The magic faction');
INSERT INTO faction (factionId, name, description) VALUES (2, 'Flicker', 'The steam faction');
INSERT INTO faction (factionId, name, description) VALUES (3, 'Bright', 'The electricity faction');

-- Add race faction default data
-- TODO Fix fame scale
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 1, 50); -- Human Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 2, 25); -- Human Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (1, 3, 75); -- Human Bright
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 1, 25); -- Kobold Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 2, 75); -- Kobold Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (2, 3, 50); -- Kobold Bright
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 1, 75); -- Ethereal Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 2, 50); -- Ethereal Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (3, 3, 25); -- Ethereal Bright
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 1, 25); -- Orc Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 2, 100); -- Orc Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (4, 3, 25); -- Orc Bright
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 1, 100); -- Slime Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 2, 25); -- Slime Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (5, 3, 25); -- Slime Bright
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 1, 25); -- Golem Glow
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 2, 25); -- Golem Flicker
INSERT INTO race_faction_default (raceId, factionId, fame) VALUES (6, 3, 100); -- Golem Bright

-- Add enemy data
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Bilge Rats', null, 10, 100, 10, 1);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Deck Squabbler', null, 20, 200, 20, 1);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Stowaway', null, 50, 500, 50, 1);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Drunken Sailor', null, 100, 1000, 100, 1);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Sea Hag', null, 1000, 10000, 1000, 1);








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