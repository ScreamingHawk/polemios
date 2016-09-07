USE polemiosDB;

-- Add maps and location data
-- TODO Better descriptions
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

-- Add store data
INSERT INTO store (name, mapId, locationX, locationY, factionId, sellsWeapons, sellsArmour, maxMint) VALUES ('Dock Weapons', 1, 1, 1, null, true, false, 1000);
INSERT INTO store (name, mapId, locationX, locationY, factionId, sellsWeapons, sellsArmour, maxMint) VALUES ('Dock Armour', 1, 1, 2, null, false, true, 1000);

-- Add shrine data
INSERT INTO shrine (name, mapId, locationX, locationY, factionId) VALUES ('Dock Shrine', 1, 0, 1, null);

-- Add signpost data
INSERT INTO signpost (mapId, locationX, locationY, description) VALUES (1, 0, 0, '<h4>Welcome to Polemios!</h4>A land of adventure, treasure and chaos. <br/><br/>If you&apos;ve just landed, you should probably find a store to equip yourself. <br/><br/>To find out more about Polemios check out the wiki. ');


-- Add weapon data
INSERT INTO weapon (name, factionId, damage, mint) VALUES ('Glowing Wand', 1, 100, 100);
INSERT INTO weapon (name, factionId, damage, mint) VALUES ('Flickering Knife', 2, 100, 100);
INSERT INTO weapon (name, factionId, damage, mint) VALUES ('Bright Pistol', 3, 100, 100);

-- Add armour data
INSERT INTO armour (name, factionId, blocks, mint) VALUES ('Glowing Cotton Robe', 1, 100, 100);
INSERT INTO armour (name, factionId, blocks, mint) VALUES ('Flickering Bronze Curiass', 2, 100, 100);
INSERT INTO armour (name, factionId, blocks, mint) VALUES ('Bright Leather Gambeson', 3, 100, 100);




-- Update complete
INSERT INTO database_version (version) VALUES (0);