"use strict";
// ***IMPORTANT**: The following lines should be added to the very
//                 beginning of the main script!
var novice = require('./novice-bootstrap.js')(__dirname);
// ***

const logger = require('novice').logger;

//var mailer = require('express-mailer');


/**
 * register the configuration files
 */
novice.registerConfigFiles(
  'novice',
  'dogma',
  'parameters',
  'services',
	'middlewares'

  // REGISTER YOUR CONFIG FILES HERE

);

novice.params.secret = "kisiwu-demingongo-novice";

var app = novice.buildApp();

/*mailer.extend(app, {
  from: 'no-reply@outerhaven.com',
  host: 'relay.skynet.be', // hostname
  secureConnection: true, // use SSL
  port: 25, // port for secure SMTP = 465
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  //auth: {
    //user: 'gmail.user@gmail.com',
    //pass: 'userpass'
  //}
});
*/
novice.getService("dogma");



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {

  logger.error(err);
	var status = err.status || 500;
    res.status(status);
    res.json({
	  status: status,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  logger.error(`An error occured`);
  console.error(err);

  var status = err.status || 500;
  res.status(status);
  res.json({
	status: status,
    message: err.message,
    error: {}
  });
});


module.exports = app;
