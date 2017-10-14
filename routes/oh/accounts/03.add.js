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
	path: '/accounts',
	method: 'POST',
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
		username: Joi.string()
		.description('username')
		.required(),
		email: Joi.string()
		.description('email')
		.required(),
		password: Joi.string()
		.description('password'),
		photo: Joi.array()
		.description('photo'),
		active: Joi.boolean()
		.description('active')
		.default(true),

		// only auth by admin
		roles: Joi.any()
	}
}),
function(req, res, next) {

	var Account = req.novice
	.getService("dogma")
	.getManager()
	.getModel('accounts');

	// format data
	var data = req.body;

	var acc = new Account(req.body);

	var validateAndSave = function(error) {
		if(error) return res.status(400).json({message: "Bad Request", error: error});

		acc.save(function (err) {
			if (err) return res.status(400).json({message: "Bad Request", error: err});

			res.status(200).json(acc);
		});
	};

	// Asynchronous way to validate
	acc.validate(validateAndSave);

});
