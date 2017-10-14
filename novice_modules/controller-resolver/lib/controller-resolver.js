// lib/controller-resolver.js
var path = require('path');

module.exports = {
	controllersDir: "controllers",
	filename: "main-controller",
	method: "index",

	setProperties: function (filename, method, controllersDir) {
		if(typeof filename === 'string')
			this.filename = filename;

		if(typeof method === 'string')
			this.method = method;

		if(typeof controllersDir === 'string')
			this.controllersDir = controllersDir;

		return this;
	},
	
	execute: function (req, res, next) {
		var appRootPath = path.dirname(require.main.filename);
		if((appRootPath.length - 4) === appRootPath.indexOf(path.sep + 'bin') || (appRootPath.length - 4) === appRootPath.indexOf(path.sep + 'app'))
			appRootPath = appRootPath.slice(0, -4);

		var controllerFile = appRootPath+"/"+this.controllersDir+"/"+this.filename+".js";
		var term = this.method.substr(0,1).toUpperCase() + this.method.substr(1);
		var method = "execute"+term;

		var controller = require(controllerFile);

		return controller[method](req, res, next);
	}
};