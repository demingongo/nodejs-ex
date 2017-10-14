var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

// findAndUpdate/Remove do not execute any hooks or validation before
// making the change in the database. You can use the runValidators option
// to access a limited subset of document validation. However, if you
// need hooks and full document validation, first query for the document
// and then save() it.
//
// http://mongoosejs.com/docs/documents.html

Novice.route({
	path: '/accounts/:id',
	method: 'PUT',
	//auth: true,
	info: {
		modelAuth: "Account",
		permissions: "ROLE_ADMIN"
	}
},
ValidatorJoi({
  body: {
    name: Joi.string()
    .description('name'),
		firstname: Joi.string()
    .description('firstname'),
		photo: Joi.array()
    .description('photo'),
		active: Joi.boolean()
    .description('active'),

		// only auth by admin
		roles: Joi.any()
  }
}),
function(req, res, next) {

	var Account = req.novice
                        .getService("dogma")
                        .getManager()
                        .getModel('accounts');

	Account.findOneAndUpdate(
		{ _id: req.params.id},
		{ $set: req.body},
		{ runValidators: true, new: true })
		//.select('-password')
		.populate('solutions')
		.exec(
		function (err, account) {
			  if (err) return next(err);
				if (!account) return res.status(404).json({message: "Unknown account"});

				// best way to update required fields is to use 'save' after 'entity.field = value;'
				account.validate(function(error){
					if(error) return res.status(400).json({message: "Bad Request", error: error});

					account.save(function (err) {
						if (err) return res.status(400).json({message: "Bad Request", error: err});

						var r = account.toObject({ virtuals: true });
						res.status(200).json(r);
					});
				});


	});

});
