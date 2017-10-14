var Novice = require('novice');
var jwt = require('jsonwebtoken');

var path = require('path');

Novice.route({
    path: "/login",
    method: "post"
},
function(req, res, next){

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
			errorMessage: '\'password\' is required',
            isAlpha: {
				errorMessage: 'Invalid \'password\' parameter'
			}
		}
	};

	req.check(schema);

	req.sanitizeBody('username').trim();
    req.sanitizeBody('password').trim();

	req.getValidationResult().then(function(result) {

		if (!result.isEmpty()) {
			return res.status(400).json(result.useFirstErrorOnly().array());
		}

        //var User = require(path.join(req.novice.params.modelsPath,"User"));

		var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');

        User.findOne({"username": req.body.username, "password": req.body.password}, function(err, user){
            var ret = {};
            if(err){
                return res.status(500).json(err);
            }
            var status = 200;
            if(!user){
                status = 400;
                ret = {message: "Authentication failed!"};
            }
			else{

        var cr64 = req.novice.getService('Crypto64');

        var p_pass = cr64.hashPassword(req.body.password);
        var dbpass = cr64.decode(user.password);

        if(dbpass != p_pass){
          status = 400;
          ret = {message: "Authentication failed!"};
        }
        else{
          ret = {
  					user: user,
  					token:
  						jwt.sign(
  							{
  								_id: user._id,
  								username: user.username,
  								collection: "users",
  								model: "User"
  							},
  							req.novice.params.secret
  						),
  				};
        }
			}
            res.status(status).json(ret);
	    });


	});
});

module.exports = Novice.Router();
