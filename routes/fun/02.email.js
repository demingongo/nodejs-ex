var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

Novice.route({
	path: '/email',
	//auth: true,
	info: {
		modelAuth: "Account"
	}
},
ValidatorJoi({
	query: {
		to: Joi.string()
		.description('username')
		.default('sdemingongo@gmail.com'),
	}
}),
function(req, res, next) {

	req.novice.getApp().mailer.send('email', {
    to: req.query.to, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Test Email', // REQUIRED.
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });

});
