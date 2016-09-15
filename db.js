var mysql = require('mysql');
var log = require('./log');
var fs = require('fs');
var async = require('async');

if (process.env.POLEMIOS_DB_DEBUG == 'true'){
	var dbConfig = {
		connectionLimit: process.env.POLEMIOS_DB_MAX_CONNECTIONS,
		host: process.env.POLEMIOS_DB_HOST,
		user: process.env.POLEMIOS_DB_USER,
		password: process.env.POLEMIOS_DB_SECRET,
		database: process.env.POLEMIOS_DB_SCHEMA,
		debug: ['ComQueryPacket', 'RowDataPacket']
	};
} else {
	var dbConfig = {
		connectionLimit: process.env.POLEMIOS_DB_MAX_CONNECTIONS,
		host: process.env.POLEMIOS_DB_HOST,
		user: process.env.POLEMIOS_DB_USER,
		password: process.env.POLEMIOS_DB_SECRET,
		database: process.env.POLEMIOS_DB_SCHEMA
	};
}
module.exports.pool = mysql.createPool(dbConfig);

sqlFromFile = function(filename, callback){
	log.debug('Executing sql file: '+filename);
	
	var fs = require('fs');
	fs.readFile(filename, 'utf8', function(err, data){
		if (err){
			log.error('Error reading database file: '+err);
			callback(err);
		} else {
			var fileDbConfig = {
				host: process.env.POLEMIOS_DB_HOST,
				user: process.env.POLEMIOS_DB_USER,
				password: process.env.POLEMIOS_DB_SECRET,
				multipleStatements: true
			};
			
			var connection = mysql.createConnection(fileDbConfig);
			connection.connect();
			connection.query(data, function(err, results){
				if (err){
					log.error("Error in batch sql: " + err);
				}
				connection.end();
				callback(err);
			});
		}
	});
};

// Return a single result from a query
module.exports.runSqlSingleResult = function(sql, params, next){
	module.exports.runSql(sql, params, function(result){
		if (result != null && result.length > 0){
			if (next != null){
				next(result[0]);
			}
			return result[0];
		}
		if (next != null){
			next(null);
		}
		return null;
	});
}

module.exports.runSql = function(sql, params, next){
	// Get connection
	module.exports.pool.getConnection(function(err, connection){
		if (err != null){
			log.error('Database connection error: '+err);
			if (connection != null){
				connection.release();
			}
			return null;
		}
		
		// Use connection
		connection.query(sql, params, function(err, result){
			connection.release();
			// Return result
			if (err != null){
				log.error('Database query error: '+err);
				if (next != null){
					next(null);
				}
			} else {
				if (next != null){
					next(result);
				}
			}
		});
	});
}

getDatabaseVersion = function(next){
	module.exports.runSqlSingleResult('SELECT MAX(version) as version FROM database_version;', null, function(result){
		var version = result.version;
		log.info("Database is at version: "+version);
		if (next != null){
			next(version);
		}
	});
}

module.exports.updateDatabase = function(next){
	getDatabaseVersion(function(version){
		if (version == null){
			module.exports.createDatabaseFromScratch(next);
		} else {
			async.eachSeries(fs.readdirSync('database'), function(name, callback){
				if (name == 'drop_schema.sql' || name == 'create_schema.sql' || name == 'initial_data.sql'){
					callback();
				} else {
					var fileversion = Number(name.split('_')[1].split('.')[0]);
					if (fileversion > version){
						log.debug("Executing upgrade: "+name+" version: "+fileversion);
						sqlFromFile('database/'+name, function(){
							module.exports.runSqlSingleResult('INSERT INTO database_version (version) VALUES (?);', [fileversion], function(){callback()});
						});
					} else {
						callback();
					}
				}
			}, function(){
				getDatabaseVersion(function(version){
					next();
				});
			});
		}
	});
};

module.exports.createDatabaseFromScratch = function(next){
	async.series([
		function(callback){
			sqlFromFile('database/drop_schema.sql', callback);
		},
		function(callback){
			sqlFromFile('database/create_schema.sql', callback);
		},
		function(callback){
			sqlFromFile('database/initial_data.sql', callback);
		},
		function(callback){
			module.exports.updateDatabase(callback);
		}
	], function(){
		if (next){
			next();
		}
	});
};