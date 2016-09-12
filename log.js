var log = require('winston');

log.remove(log.transports.Console);
log.add(log.transports.Console, {'timestamp':true, level: process.env.POLEMIOS_LOG_LEVEL});

module.exports = log;