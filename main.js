var os = require('os');
var Agenda = require('agenda');

var config = require('./config.js');
var log = require('./logger.js');

var agenda = new Agenda({ name: os.hostname() + '-' + process.pid, db: { address: config.DATABASE_CONNECTION_STRING, collection: 'job' } });

agenda.define('urlStatusCheck', { lockLifetime: 10000 }, require('./job/urlStatusCheck.js'));

log.info('Connecting agenda to ' + config.DATABASE_CONNECTION_STRING);

agenda.start();

log.info('Status warden scheduler started');


