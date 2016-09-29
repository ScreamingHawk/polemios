USE polemiosDB;

-- Add maps and location data
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (1, 'The Docks', 3, 5, false, 'The first stop for new adventurers. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (2, 'The Wilderness', 9, 9, true, 'The grand lands of Polemios stretch out before you. Everything from the crags to the forests and beyond the mountain range lies within her dominion. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (3, 'Haarish', 4, 4, false, 'The ancient Kobold city of Haarish, once a mountain, now stands a giant stone fortress. A true monument to Kobold masonry and home to the Flicker Rebellion. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (4, 'Bright Empire Capital', 4, 4, false, 'Engine smoke and fierce turrets tower over the fortress city. Home to the finest in high tech weaponry, arms and armour. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (5, 'Ethereal Palace City', 4, 4, false, 'Resonating with magical energy, the capital of Polemios'' largest empire stands a marvel of crystals, glass, and marble. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (6, 'Scaled Caves', 5, 3, false, 'Winding endlessly under the lands of Polemios are a system of caves dug out by the ancient resident Kobolds. Here at its mouth lies the embassy to the core of the world. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (7, 'Bladewood Forest', 5, 5, true, 'Populated by the more savage Orc tribes, the untamed northern Polemios stretches off into a sea of wood. The forest is known for its predators whom take advantage of prey tangled in the underbrush. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (8, 'Sears'' Caves', 3, 7, true, 'These caves are fabled to be dug out by a pair of brother kobolds in search of the Soul Stones, allegedly digging to the core of the earth. The oldest known Kobold city lies within these caves and is named after the eldest brother. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (9, 'Ethereal Labs', 4, 4, true, 'The birthplace of the slimes, filled with monstrosities and failed experiments by Ethereal and Human scientists in hopes of synthesising the Soul Stones. ' );
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (10, 'Forward Operating Base', 4, 4, true, 'The last fortification to be set up by the Bright Empire''s march into Glow Territory and the most hotly contested. It lies on a river in a corridor between the greater north and south of the continent. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (11, 'Railroads', 5, 3, true, 'A large rail yard of the Glow Empire built to supply Bladewood, marble, and ore from the rich northern frontier. Escapee slimes and prisoners of war stow away on the freight trains while the shadowy corners have been occupied by criminals and vagrants. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (12, 'Lake Azure', 4, 4, true, 'Fresh glacial melt flows into the lake, the silts giving the lake its characteristic colour. Floating in its center is a sphere of energy home to the high Emperor of the Glow Empire and the command center for the empire''s war effort. ');
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (13, 'Crystal Mines', 3, 5, true, 'Rich with veins of ore and large crystal geodes, these mines provide the Bright Empire with near endless resources. Deep in its bowels lies a cavern of Soul Stones and the ancient guardians that protect them. ' );
INSERT INTO map (mapId, name, width, height, pvp, description) VALUES (14, 'The Academy', 3, 3, false, 'Separate from any empire, The Academy serves to train elite soldiers in the art of combat and war. Few are worthy of entry and less survive to graduation. ');

-- Add race data
INSERT INTO race (raceId, name, description) VALUES (1, 'Human', 'Intelligent but frail beings. Humans washed up on the shores of Polemios after a calamaty destroyed their homeland. They excell in innovation and the development of sophisticated tools and weapons. ');
INSERT INTO race (raceId, name, description) VALUES (2, 'Kobold', 'Stout reptilian creatures. Masters of masonry and defensive warfare, kobolds are the original inhabitants of Polemios and over thousands of years dug out many mountain fortresses in search of a sacred crystal known as the Soul Stones. ');
INSERT INTO race (raceId, name, description) VALUES (3, 'Ethereal', 'Winged humanoid beings whose body is more energy than flesh. These beings of light descended unto the early feudal human kingdoms and usurped power, uniting the continent into a single empire. They rule through a meritocracy with magical prowess being the sole indicator of a citizen''s standing. ');
INSERT INTO race (raceId, name, description) VALUES (4, 'Orc', 'Large, muscular, and savage creatures of the wild forests. Although sentient, orcs rarely care for anything outside of violence and live solely for war. They roam the continent as mercenaries and tribal warriors with little regard to laws. ');
INSERT INTO race (raceId, name, description) VALUES (5, 'Slime', 'Pure energy held together in a translucent, gelatenous form whose upper half resembles that of a human. Created by ethereal and human scientists, Slimes were a failed attempt at synthesising Soul Stones and hold a great aptitude towards magic. Seen as a threat by the Glow Emperor, some slimes have been corrupted to hunt their own kind. ');
INSERT INTO race (raceId, name, description) VALUES (6, 'Golem', 'Modular mechanical frames given life by harnessing the power of the Soul Stones. Originally built to aid construction, the Soul Stones have gifted these beings with sentience and lead to their adoption by the Bright Empire. Some serve as soldiers, being retooled to harness weaponry however most prefer to serve as logisticians. ');

-- Add faction data
INSERT INTO faction (factionId, name, description) VALUES (1, 'Glow', 'The united empire founded and ruled by the Ethereals.');
INSERT INTO faction (factionId, name, description) VALUES (2, 'Flicker', 'A rebellion lead by Kobold priests to as part of their ancient prophecy surrounding the Soul Stones.');
INSERT INTO faction (factionId, name, description) VALUES (3, 'Bright', 'An empire founded in the flames of a revolution against the tyrannous Glow Empire.');

-- Add faction bonus
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (1, 2, 120); -- Glow > Flicker
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (1, 3, 80); -- Glow > Bright
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (2, 1, 80); -- Flicker > Glow
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (2, 3, 120); -- Flicker > Bright
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (3, 1, 120); -- Bright > Glow
INSERT INTO faction_faction_bonus (factionId, faction2Id, bonus) VALUES (3, 2, 80); -- Bright > Flicker

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
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Wolf', null, 500, 5000, 500, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Lepper', null, 1000, 10000, 1000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Poacher', null, 2000, 20000, 2000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Caravan Guard', null, 5000, 20000, 3000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Dire Wolf', null, 2000, 50000, 3000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Orc Wanderer', null, 5000, 50000, 5000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Highwayman', null, 7500, 75000, 7500, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Disserter', null, 10000, 100000, 10000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Bounty Hunter', null, 50000, 100000, 100000, 2);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Sparring Trainer', null, 5000, 50000, 5000, 10);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Glow Grunt', 1, 10000, 100000, 10000, 10);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Saboteur', null, 25000, 100000, 25000, 10);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Glow Lieutenant', 1, 50000, 500000, 50000, 10);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Glow Captain', 1, 100000, 900000, 100000, 10);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Vandal', null, 5000, 50000, 5000, 11);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Flicker Spy', 2, 10000, 100000, 10000, 11);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Turncoat', null, 25000, 100000, 25000, 11);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Flicker Terrorist', 2, 50000, 500000, 50000, 11);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Bright Assassin', 3, 100000, 900000, 100000, 11);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Scamp', null, 5000, 50000, 0, 8);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Glow Prospector', 1, 10000, 100000, 10000, 8);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Slime Hunter', 1, 25000, 100000, 25000, 8);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Fire Ant', null, 50000, 500000, 50000, 8);
INSERT INTO enemy (name, factionId, damage, health, mint, mapId) VALUES ('Corrupted Slime', 1, 100000, 900000, 100000, 8);

-- Add store data
INSERT INTO store (name, mapId, locationX, locationY, factionId, sellsWeapons, sellsArmour, maxMint) VALUES ('Dock Weapons', 1, 0, 1, null, true, false, 1000);
INSERT INTO store (name, mapId, locationX, locationY, factionId, sellsWeapons, sellsArmour, maxMint) VALUES ('Dock Armour', 1, 1, 0, null, false, true, 1000);

-- Add shrine data
INSERT INTO shrine (name, mapId, locationX, locationY, factionId) VALUES ('Dock Shrine', 1, 1, 1, null);

-- Add signpost data
INSERT INTO signpost (mapId, locationX, locationY, description) VALUES (1, 0, 0, '<h4>Welcome to Polemios!</h4>A land of adventure, treasure and chaos. <br/><br/>If you&apos;ve just landed, you should probably find a store to equip yourself. <br/><br/>To find out more about Polemios check out the wiki. ');

-- Add entrance data
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 1, 1, 6, 2, 4, null, null); -- Wilderness -> Docks
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (1, 2, 2, 4, 1, 6, null, null); -- Docks -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 3, 7, 8, 1, 0, null, null); -- Wilderness -> Haarish
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (3, 2, 1, 0, 7, 8, null, null); -- Haarish -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 4, 0, 0, 3, 3, null, null); -- Wilderness -> Bright Empire Capital
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (4, 2, 3, 3, 0, 0, null, null); -- BEC -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 5, 6, 4, 0, 1, null, null); -- Wilderness -> Ethereal Palace City
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (5, 2, 1, 1, 6, 4, null, null); -- EPC -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 6, 8, 1, 2, 0, null, null); -- Wilderness -> Scaled Caves
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (6, 2, 2, 0, 8, 1, null, null); -- Scaled Caves -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 7, 3, 8, 4, 0, null, null); -- Wilderness -> Bladewood Forest
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (7, 2, 4, 0, 3, 8, null, null); -- Bladewood -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 8, 8, 6, 0, 0, 2, 125); -- Wilderness -> Sears' Caves
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (8, 2, 0, 0, 8, 6, null, null); -- Sears' Caves -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 9, 2, 6, 2, 3, 2, 150); -- Wilderness -> Ethereal Labs
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (9, 2, 2, 3, 2, 6, null, null); -- Labs -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 10, 0, 3, 2, 0, 3, 125); -- Wilderness -> Forward Operating Base
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (10, 2, 2, 0, 0, 3, null, null); -- FOB -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 11, 5, 5, 0, 2, 1, 125); -- Wilderness -> Railroads
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (11, 2, 0, 2, 5, 5, null, null); -- Railroads -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 12, 5, 4, 3, 2, 3, 150); -- Wilderness -> Lake Azure
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (12, 2, 3, 2, 5, 4, null, null); -- Azure Lake -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 13, 0, 2, 1, 4, 1, 150); -- Wilderness -> Crystal Mines
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (13, 2, 1, 4, 0, 2, null, null); -- Crystal Mines -> Wilderness
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (2, 14, 3, 2, 0, 0, null, null); -- Wilderness -> The Academy
INSERT INTO entrance (mapId, map2Id, locationX, locationY, location2X, location2Y, factionId, fame) VALUES (14, 2, 0, 0, 3, 2, null, null); -- Academy -> Wilderness


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