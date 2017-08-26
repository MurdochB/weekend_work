// requires
var express = require('express');
var log4js = require('log4js');
var request = require('request');

var app = express();
var logger = log4js.getLogger();
logger.level = 'debug';

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
  // For each endpoint
  for(i = 0; i < endpoint.length; i++){
    var opt = { 'url': endpoint[i].url, 'timeout': default_timeout, json: true };
    healthcheckEndpoint(opt, endpoint[i].name);
  }
}
function healthcheckEndpoint(opt, name){
  logger.debug(name + ": healthcheck request sent");
  request(opt, function (err, res, body) {
    var retest_delay = retest_wait_time;
    if (err == null){
      logger.debug(name + ": " + body.msg);
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

console.log("Availability service listening on port " + port);
app.listen(port);