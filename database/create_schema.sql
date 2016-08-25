-- Create database
CREATE database IF NOT EXISTS polemiosDB;

USE polemiosDB;

-- Create user table
CREATE TABLE IF NOT EXISTS polemios_users(
	userId INTEGER PRIMARY KEY AUTO_INCREMENT,
	username varchar(30) UNIQUE NOT NULL,
	email varchar(200) NOT NULL,
	password char(128) NOT NULL,
	salt char(128) NOT NULL
)engine=innodb;

-- Create user table
CREATE TABLE IF NOT EXISTS characters(
	characterID INTEGER PRIMARY KEY AUTO_INCREMENT,
    name varchar(30) UNIQUE NOT NULL,
    race varchar(8)
    gear varchar(6)
    health INTEGER,
    userId INTEGER FOREIGN KEY REFERENCES polemios_users (userId)
)engine=innodb;
