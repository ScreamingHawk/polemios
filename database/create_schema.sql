--Create database
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