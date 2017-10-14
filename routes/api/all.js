var Novice = require('novice');

module.exports = Novice.route({
  name: 'middleware:solution',
  path: '/*',
  method: 'all'
}, function(req, res, next){
  Novice.logger.info(`route: _ALL /api/*`);

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
})
.Router();
