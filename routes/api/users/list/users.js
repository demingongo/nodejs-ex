var Novice = require('novice');
var jwt = require('jsonwebtoken');

var path = require('path');

Novice.route({
    path: "/",
    auth: false
},
function(req, res){

    var user = req.user;

    var userQuery = req.auth.model === "User";

    //var UserModel = require(path.join(req.novice.params.modelsPath,"User"));

    var UserModel = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');

    var solutionCb = function(){

        UserModel
        .populate(user, {
            path: "unit.solution",
            model: "solutions",
            select: "name active domains"
        }, function(err, u){

            if(err){ return res.status(500).json(err)}

            var solution = u.unit.solution;
            if(!solution.active){
                return res.status(550).json("Permission Denied");
            }

            //var origin = req.get('origin') ? req.get('origin') : req.protocol + '://' + req.get('host');

            var origin = req.get('origin');

            var allowOrigin = origin ? solution.domains.indexOf(origin) != -1 : true;

            if(!allowOrigin){
                return res.status(401).json("Origin '" + origin + "' is not allowed to access. The response had HTTP status code 401.");
            }

            //var UnitModel = require(path.join(req.novice.params.modelsPath,"Unit"));

            var UnitModel = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');

            UnitModel
            .populate(user.unit,{
                path: "users",
                model: "users"
            },
            function(err, data){
                if(err){ return res.status(500).json(err)}

                res.json(data.users);
            });
        });
    }


    var noviceCb = function(){
        if(user.hasRole("ROLE_ADMIN")){
            UserModel.find({}, function(err, data){
                if(err){ return res.status(500).json(err)}
                res.json(data);
            });
        }
        else{
            return res.status(401).json("Should first get all the solutions and")
        }
    }

    if(userQuery){
        solutionCb();
    }
    else{
        noviceCb();
    }



/*
        var Account = require(path.join(req.novice.params.modelsPath,"Account"));

        Account.findOne({"username": req.body.username, "password": req.body.password}, function(err, acc){
            if(err){
                return res.status(500).json(err);
            }
            var status = 200;
            if(!acc){
                status = 400;
                ret = {message: "Authentication failed!"};
            }
			else{
				var ret = {
					user: acc,
					token: jwt.sign({ _id: acc._id, username: acc.username }, req.novice.params.secret),
				};
			}
            res.status(status).json(ret);
	    });
*/

});
