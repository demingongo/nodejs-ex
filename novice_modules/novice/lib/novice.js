var path = require('path');
var apm = require('app-module-path');
var noviceParams = require('novice-parameters');
var NoviceServiceBag = require('./config/service-bag');
var NoviceParameterBag = require('./config/parameter-bag');
var noviceRouteCollectionClass = require('./config/route-collection');
var NoviceRoutingClass = require('./routing');

var NoviceRouting = new NoviceRoutingClass();
var Logger = require('novice-logger');

var public_dirname = 'public';

var InstanceExists = false;
var params = null;
var configFiles = [];

var authConfig = {}; //afterHandler, expressJwtOptions

var Routing =
{
    resource: 'routing'
};

var beginingState =
{
    routeCollectionClass: function() {return noviceRouteCollectionClass;}
};

var lastInit = undefined;
var stdRouter = function(){return require('express').Router()};
var routerForMethod = stdRouter();

var app = exports = module.exports = beginingState;

function noviceRequire(pathOne, pathTwo) {
    return require(resolvePath(pathOne, pathTwo));
};

function resolvePath(pathOne, pathTwo) {
  var firstArg = '';
  if(lastInit){
    firstArg = lastInit.params.getProjectRoot();
  }
  if(pathTwo)
    return path.join(firstArg, pathOne, pathTwo);
  else
    return path.join(firstArg, pathOne);
};

/** EXPORTS:
*
* logger
* require
* resolvePath
* InstanceExists
* getLastInit
* setRouter
* Router
* route
*/

exports.logger = Logger;
exports.require = noviceRequire;
exports.resolvePath = resolvePath;
exports.InstanceExists = function () {return InstanceExists;}
exports.getLastInit = function getLastInit(){
    return lastInit ;
}
exports.setRouter = function(router){
  return NoviceRouting.setRouter(router);
	//routerForMethod = typeof router === "function" ? router : routerForMethod;
};
exports.Router = function(){
  return NoviceRouting.Router();
	/*var router = routerForMethod;
	routerForMethod = stdRouter();
	return router;*/
};
exports.route = function(){

    return NoviceRouting.route.apply(NoviceRouting, arguments);

		/*params = typeof params === "object" ? params : {path: params};

		var p_name = params.name;
		var p_path = params.path;
		var p_method = params.method && typeof params.method === "string" ? params.method : "get";
        var p_auth = typeof params.auth === "boolean" ? params.auth : false;
        var p_info = params.info && typeof params.info === "object" ? params.info : {};

		if(!(p_path && typeof p_path === "string")){
			return;
		}

		//console.log(require('express').Router);

		//var route = routerForMethod({path: path, name: name});

		var args = [];
		for (var i = 1; i < arguments.length; i++) {
				args[i-1] = arguments[i];
		}

		if(p_auth){
            var jwt = require('express-jwt');

            var jwtOptions = {
                    secret: lastInit.params.secret,
                    requestProperty: 'auth',
                    credentialsRequired: false,
                    getToken: function fromHeaderOrQuerystring (req) {
                        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Novice') {
                            return req.headers.authorization.split(' ')[1];
                        } else if (req.query && req.query.token) {
                            return req.query.token;
                        }
                        return null;
                    }
                };

            if(authConfig.expressJwtOptions){
                jwtOptions = authConfig.expressJwtOptions;
            }

            if(authConfig.afterHandler){
                args.unshift(authConfig.afterHandler);
            }

			args.unshift(function (req, res, next) {    if (!req.auth) return res.sendStatus(401); next();});
            args.unshift(
                jwt(jwtOptions)
            );
		}

        var noviceRoute = {
                    name: p_name, path: p_path, method: p_method, auth: p_auth, info: p_info
                };

        args.unshift(
            function (req, res, next) {
                req.noviceRoute = noviceRoute;
                next();
            }
        );
		args.unshift(p_path);
		routerForMethod[p_method].apply(routerForMethod, args);
    */
};

/*** /EXPORTS */

app.init = function init (){

    if (!exports.InstanceExists()) {

        this.params = noviceParams;
        params = this.params;
        InstanceExists = true;
    }
    else
    {
        console.log("An instance of Novice already exists");
        this.params = params;
    }

    this.services = {};

    lastInit = this;

    //return this;
}

app.ConfigureExpressApp = function ConfigureExpressApp(app)
{
    var instance = this;

    var appName = noviceRequire('', 'package.json').name;
    //require(path.join(instance.params.getProjectRoot(), '', 'package.json')).name;

    //Logger.info(`name: ${appName}`);


    /****** settings *****/
    app.set('name', appName);
    // view engine setup
	  app.set('views', resolvePath('views'));

	try {
		var pug = require('pug');
		app.set('view engine', 'pug');
	} catch (ex) {
	}

        var noviceMiddleware = function (req, res, next)
        {
            Logger.info("xfhost", "=>",req.get('x-forwarded-host'));
            if (req.novice) return next();
            req.novice = instance;
            next();
        };

    var configureFromFiles = function (app)
    {
        for (var index = 0; index < configFiles.length; index++) {
            var element = configFiles[index];
            var fileObj = require(path.join(instance.params.getConfigDir(), '', element));

            for (var property in fileObj) {
                if (property == 'novice') {
                    instance.ConfigureNovice(fileObj['novice'], app);
                }
                else if (property == 'mysql') {
                    instance.ConfigureMysql(fileObj['mysql']);
                }
                else if (property == 'mongodb') {
                    instance.ConfigureMongoDB(fileObj['mongodb']);
                }
                else if(property == 'parameters')
                {
                    var parameters = fileObj[property];
                    for(var p in parameters){
                        pttParams[p] = parameters[p];
                    }
                }
                else if(property == 'services')
                {
                    var services = fileObj[property];
                    for(var p in services){
                        pttServices[p] = services[p];
                    }
                }
            }
        }
    }

    /***** parameters and services registration *****/

        var pttServices = {};
        var pttParams = {};
        configureFromFiles(app);

        var pb = instance.parameterBag = new NoviceParameterBag(pttParams, instance);
        instance.setParameter('novice.app_root', this.params.appRoot);
        instance.setParameter('novice.project_dir', this.params.projectRoot);
        instance.setParameter('novice.config_dir', this.params.configDir);

        instance.setParameter('novice.service_dir', path.join('%novice.project_dir%', 'services'));
        instance.setParameter('novice.utils_dir', path.join('%novice.project_dir%', 'utils'));


        var sb = instance.serviceBag = new NoviceServiceBag(pttServices, instance);


        /*
        sb.get("DatabaseModule");
        sb.get("DatabaseModule").getModel("Testtable");
        */

        /*
        var objD = {id: "123456789", collection: "solution"};
        var enc = sb.get("Crypto64").encode("objD").toString();
        var dec = sb.get("Crypto64").decode("U2FsdGVkX18tg+Dd0pFwpD0P60k0MUwu6TXhDvVMeOI=");
        */
    /***** /parameters and services registration *****/

        /****** middlewares *****/

        app.use(noviceMiddleware);


        app.use(function(req, res, next){
            res.locals.app = {user: null, name: appName };
            next();
        },function(req, res, next) {
            var anonym = { id: null, username: "anonymous", isAnonymous: true, displayName: "Anonymous", emails:[]};
            var user = req.user;
            if(user !== undefined){
	            user.isAnonymous = false;
	            res.locals.app.user = user;
            }
            else{
	            res.locals.app.user = anonym;
            }
            next();
        });

        /*
        console.log("public dir :", path.join(instance.params.getProjectRoot(), public_dirname) );

        app.use(require('express').static(path.join(instance.params.getProjectRoot(), public_dirname)));
        */

        /****** /middlewares *****/
};

app.getServiceIds = function getServiceIds()
{
    var instance = this;
    return instance.serviceBag.getServiceIds();
};

app.getService = function getService(name)
{
    var instance = this;
    return instance.serviceBag.get(name);
};

app.setService = function setService(name, any)
{
    var instance = this;
    return instance.serviceBag.set(name, any);
};

app.getParameter = function getParameter(name)
{
    var instance = this;
    return instance.parameterBag.get(name);
};

app.setParameter = function setParameter(name, any)
{
    var instance = this;
    return instance.parameterBag.set(name, any);
};

/*app.ConfigureExpressRouting = function ConfigureExpressRouting(app, routing)
{
    var instance = this;
    for(property in routing) {
        app.use(routing[property], require(path.join(instance.params.getProjectRoot(), 'routes', property.replace('__', path.sep))));
    }
};*/

app.ConfigureExpressRouting = function ConfigureExpressRouting(app)
{
    if (!(app != null && typeof app == "function")) {
        throw new TypeError("Novice::ConfigureExpressRouting - Argument 1 must be Express app");
    }

    NoviceRouting = new NoviceRoutingClass({authConfig: authConfig, secret: params.secret});

    var instance = this;

    var routingfile = path.join(instance.params.getConfigDir(), '', Routing.resource);
    var routing = require(routingfile);

    for(var property in routing) {
        var routeCollection = routing[property];
        if (!(routeCollection instanceof noviceRouteCollectionClass)) {
            routeCollection = new noviceRouteCollectionClass(routeCollection);
        }
        //console.log(routeCollection.prefix+" : "+routeCollection.getResource());
        var routers = noviceRequire('routes', routeCollection.getResource());
        //require(path.join(instance.params.getProjectRoot(), 'routes', routeCollection.getResource()));

        if(!Array.isArray(routers)){
          routers = [routers];
        }

        routers.forEach(function(routes){

          if(routes){

            if(routes.stack){
              // Log routes
              routes.stack.forEach(function(stack){
                if(!stack.route){
                  //console.log(stack);
                  return;
                }
                //stack.route.path = ("/"+stack.route.path).replace(/\/{2,}/g,"/");
                var stackPath = (routeCollection.prefix+stack.route.path)
                if(stackPath.indexOf("//") == 0)
                  stackPath = stackPath.replace("//","/");
                Object.keys(stack.route.methods).forEach(function(meth){
                  if(~stack.route.path.indexOf("//") || stack.route.path.indexOf("/") != 0){
                    Logger.warn("Something seems wrong with this path:", meth.toUpperCase(), stackPath, "( prefix:",routeCollection.prefix,"path:",stack.route.path,")");
                  }
                  else{
                    Logger.log("Loading", NoviceRoutingClass.logFormatMethod(meth), stackPath);
                  }
                });
              });

              app.use(routeCollection.prefix, routes);
            }
          }

        });
    }

    //Logger.silly("public dir ---- ", path.join(instance.params.getProjectRoot(), public_dirname) );
    //app.use(require('express').static(path.join(instance.params.getProjectRoot(), public_dirname)));
    Logger.silly("public dir ---- ", resolvePath(public_dirname) );
    app.use(require('express').static(resolvePath(public_dirname)));
};

app.ConfigureMysql = function ConfigureMysql(mysql)
{
    var instance = this;
    if(mysql !== undefined){
	    instance.services.mysql = {};
	    for(property in mysql) {
		    var mysqlConnect = require('mysql-connect');
		    mysqlConnect.config = mysql[property];
		    instance.services.mysql[property] = mysqlConnect;
	    }
    }
};

app.ConfigureMongoDB = function ConfigureMongoDB(mongodb)
{
    var instance = this;
    if(mongodb !== undefined){
	    instance.services.mongodb = {};
	    for(property in mongodb) {
		    var mongoConnect = require('mongodb-connect');
		    mongoConnect.config = mongodb[property].options || {};
            mongoConnect.url = mongodb[property].url || "" ;
		    instance.services.mongodb[property] = mongoConnect;
	    }
    }
};

app.ConfigureNovice = function ConfigureNovice(novice, app)
{
    var instance = this;

    var router = function (params) {
        if (typeof params == 'string') {
            Routing.resource = params || Routing.resource;
        }
    }

    var middlewares = function (params, app) {
        if (typeof params == 'object') {
            for (var index = 0; index < params.length; index++) {
                var element = params[index];
                app.use(element);
            }
        }
    }

    var view = function (param, app) {
        if (typeof param != 'object') {
            return;
        }
        if (typeof param.engine == 'string') {
            app.set('view engine', param.engine);
        }
    }

    var setFavicon = function (param, app) {
        var favicon = require('serve-favicon');
        if (typeof param == 'string') {
            app.use(favicon(path.join(instance.params.getProjectRoot(), public_dirname, param)));
        }
    }

	var corsEnabled = false;
	var cors;

	var enableCors = function (param, app) {
        if (typeof param === 'boolean' && param) {
			if(typeof cors === 'undefined'){
				cors = require('cors');
			}
			if(!corsEnabled){
				app.options('*', cors());
				corsEnabled = true;
			}
			app.use(cors());
        }
		else if(typeof param === 'object'){
			if(typeof cors === 'undefined'){
				cors = require('cors');
			}

            var corsOptionsDelegate = param;
            if(Array.isArray(param.blacklist)){
                var blacklist = param.blacklist;
                Logger.warn("blacklist origins", blacklist);
                delete param.blacklist;
                corsOptionsDelegate = function(req, callback){
                    var corsOptions = {};
                    for (var p in param) {
                        corsOptions[p] = param[p];
                    }
				    if(blacklist.indexOf(req.header('Origin')) == -1){
    					corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
				    }else{
    					corsOptions.origin = false; // disable CORS for this request
				    }
				    callback(null, corsOptions); // callback expects two parameters: error and options
			    };
            }
            if(!corsEnabled){
				app.options('*', cors(corsOptionsDelegate));
				corsEnabled = true;
			}
			app.use(cors(corsOptionsDelegate));
		}
		else if(typeof param === 'function'){
			if(typeof cors === 'undefined'){
				cors = require('cors');
			}
			if(!corsEnabled){
				app.options('*', cors(param));
				corsEnabled = true;
			}
			app.use(cors(param));
		}
        else if(Array.isArray(param)){
            if(typeof cors === 'undefined'){
				cors = require('cors');
			}
            Logger.warn("whitelist origins", param);
            var corsOptionsDelegate = function (req, callback) {
                var corsOptions = {origin: false};
                if (param.indexOf(req.header('Origin')) !== -1) {
                    corsOptions = {origin: true}; // reflect (enable) the requested origin in the CORS response
                } else {
                    corsOptions.origin = false; // disable CORS for this request
                }
                callback(null, corsOptions); // callback expects two parameters: error and options
            };
			if(!corsEnabled){
				app.options('*', cors(corsOptionsDelegate));
				corsEnabled = true;
			}
			app.use(cors(corsOptionsDelegate));
		}
    }

    var auth = function (param, app) {
        if (typeof param === 'object') {
            authConfig = param;
        }
    }



    if(novice !== undefined){
	    router(novice.router);
        middlewares(novice.middlewares, app);
        view(novice.view, app);
        setFavicon(novice.favicon, app);
		enableCors(novice.cors, app);
        auth(novice.auth, app);
    }
};

app.registerConfigFiles = function registerConfigFiles(array)
{
    if (arguments.length == 1 && Array.isArray(array) ) {
        configFiles = array;
    }
    else
    {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'string') {
                configFiles.push(arguments[i]);
            }
        }
    }
};

app.buildApp = function buildApp() {

    var app = require('express')();

    this.ConfigureExpressApp(app);

    this.ConfigureExpressRouting(app);

    this.parameterBag.resolveAll();

    this.getApp = function(){
      return app;
    }

    return app;
};
