/*
 * Logger
 * Output to console, store to files
 */

"use strict";

var winston = require('winston');
var moment = require('moment-timezone');

var Config = require('ivanoff-config');
var config = new Config();

var logLevel = process.env.LOG_LEVEL || 'info';

var logger = function() {
  winston.emitErrs = true;

  winston.setLevels({debug: 7, info: 6, money: 5, warn: 4, error: 3});
  winston.addColors({debug: 'green', info: 'blue', money: 'yellow', warn: 'cyan', error: 'red'});

  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level: logLevel,
    colorize: true,
    timestamp: function() {
        return moment().tz("Europe/Kiev").format();
    },
  });

  if(config.log.full) {
    winston.add(winston.transports.File, { name: 'full', filename: config.log.full, level: 'info' });
  }

  if(config.log.error) {
    winston.add(winston.transports.File, { name: 'error', filename: config.log.error, level: 'error', handleExceptions: true });
  }

  if(config.log.sell) {
    winston.loggers.add('sell', { file: { name: 'sell', filename: config.log.sell, level: 'silly', json: false } });
    var sellLog = winston.loggers.get('sell');
    sellLog.remove(winston.transports.Console);

    winston.sell = function(message, encoding){
      winston.money(message);
      sellLog.info(message);
    }
  }

  return winston;
}

logger.instance = null;

logger.getInstance = function(){
    if(this.instance === null){
        this.instance = new logger();
    }
    return this.instance;
}

module.exports = logger.getInstance();
