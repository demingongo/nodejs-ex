var Novice = require('novice');
var jwt = require('jsonwebtoken');

var path = require('path');

/**
* accounts login
*/
Novice.route({
  path: "/login",
  method: "post"
},
function(req, res, next){
  req.__userCollection = "accounts";
  req.__userModel = "Account";
  next();
},
loginHandler
);


/**
* users login
*/
Novice.route({
  path: "/token",
  method: "post"
},
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

    req.__userSolutionId = sol._id;

    var Unit = req.novice.getService("dogma").getModel("units");
    Unit.find(
      {
        solution: _id
      },
      function(err, units){
        if (err || !units){
          return res.status(500).json(err);
        }

        if(!units.length){
            return res.status(404).json({message: "Unknown unit", error: err});
        }

        req.__userQuery = {
          "unit": {
            "$in": units.map(function(u){
              return u._id;
            })
          }
        };
        next();
      }
    );
  });

  req.__userCollection = "users";
  req.__userModel = "User";
},
loginHandler
);

function loginHandler(req, res, next){

var schema = {
  'username': {
    in: 'body',
    notEmpty: true,
    errorMessage: '\'username\' is required',
    isAlpha: {
      errorMessage: 'Invalid \'username\' parameter'
    }
  },
  'password': {
    in: 'body',
    notEmpty: true,
    errorMessage: '\'password\' is required'/*,
    isAlpha: {
      errorMessage: 'Invalid \'password\' parameter'
    }*/
  }
};

req.check(schema);

req.sanitizeBody('username').trim();
req.sanitizeBody('password').trim();



req.getValidationResult().then(function(result) {

  if (!result.isEmpty()) {
    return res.status(400).json(result.useFirstErrorOnly().array());
  }

  var collection = req.novice
  .getService("dogma")
  .getManager()
  .getModel(req.__userCollection)

  var query = req.__userQuery || {};

  query["username"] = req.body.username;

  collection.findOne(
    query,
    function(err, doc){
      if(err){
        return res.status(500).json(err);
      }
      var status = 200;
      var v_return = {};
      var Crypto64 = req.novice.getService('Crypto64');
      //if account wasn't found or found but wrong password
      if(!doc)
      {
        status = 404;
        v_return = {message: "Authentication failed!"};
      }
      else if(!Crypto64.comparePasswords(req.body.password, doc.password)){
        status = 400;
        // in case i want to set a new pwd bc I forgot the previous one OR didn't use the same salt
        var newValue = Crypto64.hashcode(req.body.password);
        v_return = {
          message: "Authentication failed!"
          /*, pass1: req.body.password,
          pass2: doc.password,
          hashcode: newValue*/
        };
        /*doc.password = newValue;
        doc.save(function (err, product, numAffected) {

          console.log(err);
          console.log(product);
          console.log(numAffected);
        });*/
      }
      else{
        var user = doc.toObject({ virtuals: true });
        delete user.password;
        v_return = {
          user: user,
          token:
          jwt.sign(
            {
              _id: doc._id,
              username: doc.username,
              collection: req.__userCollection,
              model: req.__userModel,
              solution: req.__userSolutionId || undefined
            },
            req.novice.params.secret
          )
        };
      }
      res.status(status).json(v_return);
    });

  });
}

  module.exports = Novice.Router();
