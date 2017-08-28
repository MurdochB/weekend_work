// requires
var express = require('express');
var log4js = require('log4js');
var request = require('request');

var app = express();

log4js.configure({
  appenders: {
    console: { type: 'console', },
    log_file: { type: 'file', filename: 'logs/app.log' }
  },
  categories: {
    onlyConsole: { appenders: ['console'], level: 'trace' },
    default: { appenders: ['console', 'log_file'], level: 'debug' }

  }
});

var logger = log4js.getLogger();
var onlyConsoleLogger = log4js.getLogger('onlyConsole');
onlyConsoleLogger.info('Logger starting up with level: ' + onlyConsoleLogger.level);
onlyConsoleLogger.trace('- TRACE');
onlyConsoleLogger.debug('- DEBUG');
onlyConsoleLogger.info('- INFO');
onlyConsoleLogger.warn('- WARN');
onlyConsoleLogger.error('- ERROR');
onlyConsoleLogger.fatal('- FATAL');

// config
var port = 3002;
var default_timeout = 3000;         // How long to wait for a request to complete
var retest_wait_time = 1000;        // How long to wait after a health check to do another
var error_retest_wait_time = 1000;  // How long to wait after a unsuccessful health check to do another

var dummy_service_base_url = "http://localhost:3001";
// Endpoints to test
var endpoint = [
  {  "name": "random_delay_or_drop", "url": dummy_service_base_url + "/endpoint/random_delay_or_drop" }
];

healthcheckAllEndpoints();

function healthcheckAllEndpoints(){
  logger.info("#   Starting healthcheck for all endpoints    #");
  // For each endpoint
  for(i = 0; i < endpoint.length; i++){
    var opt = { 'url': endpoint[i].url, 'timeout': default_timeout, json: true, time: true };
    logger.info("#   Healthcheck for \"" + endpoint[i].name + "\" started.");
    healthcheckEndpoint(opt, endpoint[i].name);
  }
}
function healthcheckEndpoint(opt, name){
  logger.debug("healthcheck request sent to: " + name);
  request(opt, function (err, res, body) {
    var retest_delay = retest_wait_time;
    if (err == null){
      logger.info(name + ": SUCCESS in " + res.elapsedTime + "ms");
    }else{
      logger.error(name + ": " + err);
      retest_delay = error_retest_wait_time;
    }

    setTimeout(function(){
      healthcheckEndpoint(opt, name);
    }, retest_delay);
  });
}



// capture all requests
app.use(function(req, res, next){
  logger.debug("GET - " + req.url);
  next();
});
app.route('/')
  .get(function(req, res){
    res.json(
      {
        "success": true,
        "msg": "You have requested ROOT on the availability service"
      }
    );
  });

onlyConsoleLogger.info("Availability service listening on port " + port);
app.listen(port);
