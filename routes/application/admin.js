var Novice = require('novice');

Novice.route(
    "/accounts",
    function(req, res, next){
        res.json("form view");
    }
);

module.export = Novice.Router();