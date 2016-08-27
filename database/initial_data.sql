USE polemiosDB;

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
INSERT INTO faction (factionId, name, description) VALUES (2, 'Flame', 'The steam faction');
INSERT INTO faction (factionId, name, description) VALUES (3, 'Lightning', 'The electricity faction');

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

-- Add maps and location data
-- TODO Better descriptions
-- TODO Remove test locations
INSERT INTO map (name, height, width, pvp, description) VALUES ('Test Town', 5, 5, true, 'A test map with one of each location type');
INSERT INTO map (name, height, width, pvp, description) VALUES ('Glow Cavern', 5, 5, false, 'The home of new glow users');
INSERT INTO map (name, height, width, pvp, description) VALUES ('Flame Volcano', 5, 5, false, 'The home of new flame users');
INSERT INTO map (name, height, width, pvp, description) VALUES ('Electric Boogaloo', 5, 5, false, 'The home of new electric users');
INSERT INTO map (name, height, width, pvp, description) VALUES ('Wilderness', 2, 5, true, 'A long zone for joining maps');
