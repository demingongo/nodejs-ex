var Novice = require('novice');

Novice.route({
	path: '/accounts/:id',
	//auth: true,
	info: {
		modelAuth: "Account"
	}
},
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');

	Account.findOne({
		_id: req.params.id
	},
	'-password')
	.populate('solutions')
	.exec(
	function(err, account) {
		if (err) return next(err);
		if (!account) return res.status(404).json({message: "Unknown account"});

		/**
		* - account.toObject({ virtuals: true }) ;
		* if need to return populated virtual attributes
		*/
		var r = account.toObject({ virtuals: true });
		res.status(200).json(r);
	});

});
