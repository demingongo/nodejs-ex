var express = require('express');
var Novice = require('novice');
var url = require("url");
var querystring = require('querystring');
var assert = require('assert');

var path = require('path');

//var modelsPath = Novice.getLastInit().params.modelsPath;//path.join(Novice.getLastInit().params.getProjectRoot() , "models" );

//var form = require('novice-form');
/*
var Account = require(path.join(modelsPath,"Account"));
var Solution = require(path.join(modelsPath,"Solution"));
var Unit = require(path.join(modelsPath,"Unit"));
var User = require(path.join(modelsPath,"User"));
var Article = require(path.join(modelsPath,"Article"));
*/

Novice.route({
  path: '/*',
  method: 'all'
}, function(req, res, next){
  Novice.logger.debug(`"All" method called in /dev/* path`);
  next();
});

Novice.route({
  path: 'pass1',
  method: 'param'
}, function(req, res, next, value, name){
  Novice.logger.warn(`"Param" method called when "${name}" param in path - btw, value is ${value}`);
  next();
});

Novice.route(
{
    path: '/resetdb',
    auth: false
},
//create account
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	//var Account = require(path.join(modelsPath,"Account"));

	var art = new Account({
		username: "test",
		password: "testtest",
		email: "stefanlitemo@gmail.com",
		roles: ["ROLE_ADMIN", "ROLE_USER"]
	});

	var save = function(){
		art.save(function (err) {
  			if (err){
				//return res.status(400).json({message: "Bad Request", error: err});
			}
			else{
				//return res.status(200).json(art);
			}
			next();
		});
	};

	var validateAndSave = function(error) {
		if(error){
			return res.status(400).json({message: "Bad Request", error: error});
		}
		else{
			save();
		}
	};

	// Asynchronous way to validate
	art.validate(validateAndSave);
},
//create solution
function(req, res, next) {
	//var Account = require(path.join(modelsPath,"Account"));
	//var Solution  = require(path.join(modelsPath,"Solution"));

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	var sol = new Solution({
			/* solutionSecret: "testtest",*/
			solutionID: "testtest",
			domains: ["http://localhost:8080"],
			name: "monolithic"
	});

	var save = function(){
		sol.save(function (err) {
  			if (err){
				//return res.status(400).json({message: "Bad Request", error: err});
			}
			else{
				//return res.status(200).json(sol);
			}
			next();
		});
	};


	var validateAndSave = function(error) {
		if(error){
			return res.status(400).json({message: "Bad Request", error: error});
		}
		else{
			save();
		}
	};

	Account.findOne({username: "test"}, function(err, acc){
		sol.owner = acc;
		sol.validate(validateAndSave);
	});
},
//create unit
function(req, res, next) {
	//var Unit = require(path.join(modelsPath,"Unit"));
	//var Solution  = require(path.join(modelsPath,"Solution"));

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	var unit = new Unit({
			name: "superunit"
	});

	var save = function(){
		unit.save(function (err) {
  			if (err){
				//return res.status(400).json({message: "Bad Request", error: err});
			}
			else{
				//return res.status(200).json(unit);
			}
			next();
		});
	};


	var validateAndSave = function(error) {
		if(error){
			return res.status(400).json({message: "Bad Request", error: error});
		}
		else{
			save();
		}
	};

	Solution.findOne({solutionID: "testtest"}, function(err, sol){
		unit.solution = sol;
		unit.validate(validateAndSave);
	});
},
//create users
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

  var Crypto64 = req.novice.getService('Crypto64');

  var pass1 = "testtest";
  var pass2 = "azertyazerty";

  pass1 = Crypto64.hashcode(pass1);
  pass2 = Crypto64.hashcode(pass2);

	var user1 = new User({
		username: "test",
		password: pass1,
		emails: ["stefanlitemo@gmail.com"],
		roles: ["ADMIN", "USER", "VIEWER"]
	});

	var user2 = new User({
		username: "azerty",
		password: pass2,
		emails: ["sbolingo@outlook.com"],
		roles: ["ADMIN", "USER", "VIEWER"]
	});

	var msgs = [];
	var sendResp = function(msg){
		msgs.push(msg);

		if(msgs.length == 2){
			return res.status(200).json(msgs);
		}
	}

	var save = function(user){
		user.save(function (err) {
  			if (err){
				//return res.status(400).json({message: "Bad Request", error: err});
				sendResp({status: 400, message: "Bad Request", error: err});
			}
			else{
				//return res.status(200).json(user);
				sendResp({status: 200, data: user});
			}
			//next();
		});
	};


	var validateAndSave1 = function(error) {
		if(error){
			sendResp({status: 400, message: "Bad Request", error: error});
			//return res.status(400).json({message: "Bad Request", error: error});
		}
		else{
			save(user1);
		}
	};

	var validateAndSave2 = function(error) {
		if(error){
			sendResp({status: 400, message: "Bad Request", error: error});
			//return res.status(400).json({message: "Bad Request", error: error});
		}
		else{
			save(user2);
		}
	};

	Solution.findOne({solutionID: "testtest"}, function(err, sol){
		Unit.findOne({name: "superunit", solution: sol._id}, function(err, unit){
			user1.unit = unit._id;
			user1.validate(validateAndSave1);
			user2.unit = unit._id;
			user2.validate(validateAndSave2);
		});
	});
});







Novice.route('/dropall',
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	User.remove({}, function(err) {
		console.log('collection User removed')
	});

	Unit.remove({}, function(err) {
		console.log('collection Unit removed')
	});

	Solution.remove({}, function(err) {
		console.log('collection Solution removed')
	});

	Account.remove({}, function(err) {
		console.log('collection Account removed')
	});

	res.status(200).json("Drop all");
});






Novice.route({
	path: '/accounts',
	//auth: true,
	info: {
		permissions: "ROLE_ADMIN"
	}
},
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	var limit = 5;
	var page = 1;

	//var Account = require(path.join(modelsPath,"Account"));

	var query = Account.find({});

	query.count(function(err, count) {
		if (err) return next(err);
		query.sort({createdAt: -1}).skip((page-1) * limit).limit(limit).exec('find', function(err, docs) {
			if (err) return next(err);
			res.status(200).json({
				docs: docs,
				count: count,
				limit: limit
			});
		});
	});
});

Novice.route(
  {
      path: '/solutions',
      auth: false,
      method: 'GET'
  },
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	//console.log(req.user);

	//var Solution  = require(path.join(modelsPath,"Solution"));

	Solution.find({}).populate('owner').exec(function(err, sol) {
		if (err){
				return res.status(400).json({message: "Bad Request", error: err});
		}
		else{
				return res.status(200).json(sol);
		}
	});
});

Novice.route(
  {
      path: '/crypto/:pass1/:pass2',
      auth: false,
      method: 'GET'
  },
function(req, res, next) {

  var Crypto64 = req.novice.getService('Crypto64');

  var p1 = Crypto64.hashcode(req.params.pass1);
  var p2 = req.params.pass2;

  var r = Crypto64.comparePasswords(p2, p1);

  res.json({pass1: p1, pass2: p2, r: r});

});

Novice.route('/app',
function(req, res, next){

  var from,
      fromArray,
      _id,
      owner;

  // get 'From' header
  from = req.get('from');

  fromArray = ( from || '' ).split('@');

  if(fromArray.length != 2){
    return res.status(400).json({message: "Must specify solution"});
  }

  _id = fromArray[0];
  owner = fromArray[1];

  var Solution = req.novice.getService("dogma").getModel("solutions");

  Solution.findOne({
    _id: _id,
    owner: owner
  })
  .populate("owner")
  .exec(function(err, sol){
    if (err || !sol){
				return res.status(404).json({message: "Unknown solution", error: err});
		}
		else{
        req.session.solution = sol;
				next();
		}
  });
},
function(req, res, next) {
  Novice.logger.log(req.session.solution);
  res.json(req.session.solution);
});

module.exports = Novice.Router();
