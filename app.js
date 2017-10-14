const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      env          = process.env;

const expressApp = require('./app/app.js');

const logger = require('novice').logger;

// IMPORTANT: Your application HAS to respond to GET /health with status 200
//            for OpenShift health monitoring
const server = http.createServer(expressApp);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || 'localhost';

server.listen(port, ip, function () {
  logger.info(`Application worker ${process.pid} started...`);
  logger.info(`Server running on http://${ip}:${port}`)
});
