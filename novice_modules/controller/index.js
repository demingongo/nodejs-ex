
var path = require('path');

exports = module.exports = function controller(cdir){
  return function controller(req, res, next) {

	/*if(!(typeof req.route !== 'undefined')){
		return next();
	}*/

	var controllersDir = "controllers";
	var filename = "main-controller";
	var method = "index";
	
	if(cdir && typeof cdir === 'string'){
		controllersDir = cdir;
	}

	if(req._controller && typeof req._controller === 'string'){
		var posPoint = req._controller.indexOf('.');
		if(posPoint != -1){
			filename = req._controller.substr(0, posPoint);
			method = req._controller.substr(posPoint+1);
		}
	}

	/*if(req.filename && typeof req.filename === 'string'){
		filename = req.filename;
	}

	if(req.methodo && typeof req.methodo === 'string'){
		method = req.methodo;
	}*/

    var appRootPath = path.dirname(require.main.filename);
		if((appRootPath.length - 4) === appRootPath.indexOf(path.sep + 'bin'))
			appRootPath = appRootPath.slice(0, -4);

		var controllerFile = appRootPath+"/"+controllersDir+"/"+filename+".js";
		var term = method.substr(0,1).toUpperCase() + method.substr(1);
		var method = "execute"+term;

		var controller = require(controllerFile);
		
		console.log(res);
		return controller[method](req, res, next);
  };
};