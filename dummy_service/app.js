// requires
var express = require('express');
var log4js = require('log4js');

var app = express();
var logger = log4js.getLogger();
logger.level = 'debug';

// config
var port = 3001;

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
        "msg": "You have requested ROOT on the dummy service"
      }
    );
  });

app.get('/endpoint', function(req, res){
  res.json(
    {
      "success": true,
      "msg": "listing endpoints",
      "endpoints": [
        {"/gen_number": "Generates a random number between 1-10 (inc)"},
        {"/always_drop": "Drops your request"},
        {"/random_drop": "Occasionally drops the request"},
        {"/random_delay": "Takes time to do the request"},
        {"/random_delay_or_drop": "Takes time to do the request, occasionally drops the request"}
      ]
    }
  );
});

app.get('/endpoint/gen_number', function(req, res){
  var rand_num = Math.floor(Math.random() * 10) + 1;
  logger.debug("Random number generated: " + rand_num);

  //res.status(200);
  res.json(
    {
      "success": true,
      "msg": "Generated a number",
      "num": rand_num
    }
  );
});

app.get('/endpoint/always_drop', function(req, res){
  logger.error("Request dropped");
});

app.get('/endpoint/random_drop', function(req, res){
  var drop_rate = 5;
  var rand_num = Math.floor(Math.random() * drop_rate) + 1;
  if (rand_num != drop_rate){
    res.json(
      {
        "success": true,
        "msg": "I didn't drop you this time"
      }
    );
  }else{
    logger.error("Request dropped");
  }
});

app.get('/endpoint/random_delay', function(req, res){
  var max_delay = 1600;

  var delay = Math.floor(Math.random() * max_delay) + 1;
  logger.debug("Delaying by " + delay + "ms");

  setTimeout(function(){
    res.json(
      {
        "success": true,
        "msg": "I delayed myself " + delay
      }
    );
  }, delay);
});

app.get('/endpoint/random_delay_or_drop', function(req, res){
  var max_delay = 700;
  var min_delay = 300;
  var drop_rate = 5;
  var rand_num = Math.floor(Math.random() * drop_rate) + 1;

  if (rand_num != drop_rate){
    var delay = Math.floor(Math.random() * (max_delay-min_delay)) + min_delay;
    logger.debug("Request delaying by " + delay + "ms");

    setTimeout(function(){
      logger.debug("Responding");
      res.json(
        {
          "success": true,
          "msg": "I delayed myself " + delay
        }
      );
    }, delay);
  }else{
    logger.error("Request dropped");
  }
});

console.log("Dummy service listening on port " + port);
app.listen(port);
