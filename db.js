var mysql = require('mysql');
var log = require('winston');

if (process.env.POLEMIOS_DB_DEBUG == 'true'){
	module.exports.pool = mysql.createPool({
		connectionLimit: process.env.POLEMIOS_DB_MAX_CONNECTIONS,
		host: process.env.POLEMIOS_DB_HOST,
		user: process.env.POLEMIOS_DB_USER,
		password: process.env.POLEMIOS_DB_SECRET,
		database: process.env.POLEMIOS_DB_SCHEMA,
		debug: ['ComQueryPacket', 'RowDataPacket']
	});
} else {
	module.exports.pool = mysql.createPool({
		connectionLimit: process.env.POLEMIOS_DB_MAX_CONNECTIONS,
		host: process.env.POLEMIOS_DB_HOST,
		user: process.env.POLEMIOS_DB_USER,
		password: process.env.POLEMIOS_DB_SECRET,
		database: process.env.POLEMIOS_DB_SCHEMA
	});
}

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
				return null;
			} else {
				if (next != null){
					next(result);
				}
				return result;
			}
		});
	});
}