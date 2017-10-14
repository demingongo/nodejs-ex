var Novice = require('novice');

Novice.route({
    path: "/me",
    auth: true
},
function(req, res){
    res.json(req.user);
});
