var Novice = require('novice');

Novice.route({
  path: "/dogma"
}, function(req, res){
  const DOGMA = req.novice.getService('dogma');
  var Account = DOGMA.getModel("accounts");

  Account.find({}, function(err, data){
      if(err){
          return res.status(500).json(err);
      }
      res.status(200).json(data);
  });
});

module.exports = Novice.Router();
