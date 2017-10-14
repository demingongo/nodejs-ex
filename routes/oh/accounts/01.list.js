var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

Novice.route({
	path: '/accounts',
	//auth: true,
	info: {
		//modelAuth: "Account",
		//permissions: "ROLE_ADMIN"
	}
},
ValidatorJoi({
  query: {
    limit: Joi.number()
    .description('limit')
		.default(5),
		page: Joi.number()
    .description('page')
		.min(1)
		.default(1),
		sort: Joi.string()
    .description('sort')
		.default("createdAt"),
		order: Joi.string()
    .description('sort')
		.only('asc','desc')
		.default("desc")
  }
}),
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');
	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');
	var Unit = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('units');
	var User = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('users');
	var Article = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('articles');

	var limit = req.query.limit;
	var page = req.query.page;

	var sort = {};
	sort[req.query.sort] = req.query.order == "desc" ? -1 : 1;

	//var Account = require(path.join(modelsPath,"Account"));

	var query = Account.find({}, '-password');

	query.count(function(err, count) {
		if (err) return next(err);
		query.sort(sort).skip((page-1) * limit).limit(limit).exec('find', function(err, docs) {
			if (err) return next(err);
			res.status(200).json({
				docs: docs,
				count: count,
				limit: limit,
				page: page
			});
		});
	});
});
