var Novice = require('novice');

Novice.route({
	path: '/solutions',
	//auth: true,
	info: {
		modelAuth: "Account",
		permissions: "ROLE_ADMIN"
	}
},
function(req, res, next) {

	var Solution = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('solutions');

	var limit = 5;
	var page = 1;

	var query = Solution.find({});

	query.count(function(err, count) {
		if (err) return next(err);
		query.sort({createdAt: -1}).skip((page-1) * limit).limit(limit).exec('find', function(err, docs) {
			if (err) return next(err);
			res.status(200).json({
				docs: docs,
				count: count,
				limit: limit
			});
		});
	});
});
