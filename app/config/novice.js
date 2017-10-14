/** PROTOTYPES FOR JAVASCRIPT CLASSES */
var path = require('path');

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

/** /PROTOTYPES FOR JAVASCRIPT CLASSES */

var novice = {
	novice: {
		/**
		 * The file where the routing is
		 */
		router: "routing",

		/**
		 * The cors configuration (npm: cors)
		 */
		cors: {
			"origin": "*",
			"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
			"preflightContinue": false,
			"allowedHeaders": ['Content-Type', 'Authorization', 'From'],
			//"blacklist": ["http://localhost:8024"]
		},

		/**
		 * The authorisation config route is registered via Novice (Novie.route(...)) and {auth: true}.
		 * Search for JWT token and decode token (default: req.auth, change it in property expressJwtOptions)
		 * properties: afterHandler, expressJwtOptions
		 */
		auth: {
			/**
			 * Handler after the token has been decoded and put in req.auth
			 */
			afterHandler: function(req, res, next){
        const DOGMA = req.novice.getService('dogma');
        var User = DOGMA.getModel(req.auth.collection);
				//var User = require(path.join(req.novice.params.modelsPath,req.auth.model));

        var userQuery = req.auth.model === "User";

        if(req.noviceRoute.info.modelAuth && req.noviceRoute.info.modelAuth != req.auth.model){
          return res.status(550).json("Permission Denied");
        }


        /**
        * to make a query on a populated field, it's better to use aggregate than populate
        *
        * for aggregate, do not forget to convert to ObjectId when needed
        */
				var query = userQuery ?
					User/*.findOne({"_id": req.auth._id}).populate({
						path: 'unit',
            model: 'units',
            match: { solution: req.auth.solution, active: true},
            populate: {
              path: 'solution',
              model: 'solutions',
              match: { active: false }
            }
          })*/
          .aggregate([
            { "$match": { "_id": DOGMA.getManager().toObjectId(req.auth._id) } },
            {
              "$lookup": {
                "from": "units",
                "localField": "unit",
                "foreignField": "_id",
                "as": "unit"
              }
            },
            { "$unwind": "$unit" },
            { "$match": { "unit.active": true } },
            {
              "$lookup": {
                "from": "solutions",
                "localField": "unit.solution",
                "foreignField": "_id",
                "as": "unit.solution"
              }
            },
            { "$unwind": "$unit.solution" },
            { "$match": { "unit.solution.active": true } }
          ]) : User.aggregate([
            { "$match": {"_id": DOGMA.getManager().toObjectId(req.auth._id) } }
          ]);

				query.exec(function(err, data){

            //console.log(err);

            data = data && data.length ? data[0] : undefined;

            		if(err){
	                	return res.status(500).json(err);
            		}
					if(!data){
						return res.status(403).json({message: "Permission Denied"});
					}

          if(userQuery){
            if(!(data.unit && data.unit.solution)){
              return res.status(403).json({message: "Permission Denied"});
            }
          }

					req.user = data;

					if(req.noviceRoute){
						var role = req.noviceRoute.info.permissions;
						if(role && !data.hasRole(role)){
							return res.status(403).json("Permission Denied");
						}
					}

            		next();
	    		});
			},

			/**
		 	 * The jwt configuration (npm: express-jwt)
		 	 */
			/*expressJwtOptions: {
				secret: "shhhhhhh"
			}*/
		},

		view: {
			/**
			 * The view engine (if not set, novice uses 'pug' by default if pug installed)
			 */
			//engine: "pug"
		},

		// uncomment after placing your favicon in /public
		//favicon: "favicon.png",
	}
};

module.exports = novice;
