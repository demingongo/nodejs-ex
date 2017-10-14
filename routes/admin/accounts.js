var Novice = require('novice');
var jwt = require('jsonwebtoken');

var path = require('path');

Novice.route({
    path: "/",
    auth: true,
    info: {
        permissions: "ROLE_ADMIN"
    }
},
function(req, res){
        //var Account = require(path.join(req.novice.params.modelsPath,"Account"));
		var  dogma = req.novice
                        .getService("dogma");

		var  manager = req.novice
                        .getService("dogma")
                        .getManager();

        var Account = manager.getModel('accounts');

        Account.find({}, function(err, data){
            if(err){
                return res.status(500).json(err);
            }
            res.status(200).json(data);
	    });

});

module.exports = Novice.Router();
