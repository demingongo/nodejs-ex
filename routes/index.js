var Novice = require('novice');
var url = require("url");
var querystring = require('querystring');
var assert = require('assert');

var path = require('path');
const SysInfo = Novice.require('utils/sys-info');

/** APP Info */
Novice.route(
{
    name: 'stats',
    method: 'get',
    path: '/',
    auth: false
},
function(req, res, next) {

	/*console.log(req.novice.params.getAppRoot());
	console.log(req.novice.params.getProjectRoot());*/

	/*var page = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);*/
	var title = 'Welcome to Novice';

	//var appRoot = req.novice.params.getAppRoot();
	//var projectRoot = req.novice.params.getProjectRoot();
	res.sendFile(path.join(req.novice.getParameter('novice.project_dir'),'public/index.html'));
	//res.status(200).json(title);
});

Novice.route('/index', function(req, res, next) {
  res.redirect('/');
});

Novice.route('/xfhost',
function(req, res, next) {
	res.status(200).json(req.get('x-forwarded-host'));
});

// IMPORTANT: Your application HAS to respond to GET /health with status 200
//            for OpenShift health monitoring
Novice.route('/health',
function(req, res, next) {
	res.sendStatus(200);
});
Novice.route('/info/gen', sysInfoCtrl);
Novice.route('/info/poll', sysInfoCtrl);

function sysInfoCtrl(req, res, next) {
	var url = req.url;
    res.header('Cache-Control', 'no-cache, no-store');
    res.status(200).json(SysInfo[url.slice(6)]());
}
/** /APP Info */

module.exports = Novice.Router();
