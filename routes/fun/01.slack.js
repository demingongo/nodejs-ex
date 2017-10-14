var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

Novice.route({
	path: '/slack',
	//auth: true,
	info: {
		modelAuth: "Account"
	}
},
ValidatorJoi({
	query: {
		username: Joi.string()
		.description('username')
		.default('stephane'),
		iconUrl: Joi.string()
		.description('iconUrl')
		.default('http://vignette2.wikia.nocookie.net/p__/images/4/48/Luke_Skywalker_ROTJ.png/revision/latest?cb=20150807150222&path-prefix=protagonist'),
	}
}),
function(req, res, next) {

		res.status(503).json({message: "Service in construction"});

});
