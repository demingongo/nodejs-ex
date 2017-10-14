var mongoose = require('mongoose');
require('mongoose-type-url');
var CryptoJS = require("crypto-js");
var Schema = mongoose.Schema;

var accountSchema = require("./AccountSchema");

var SolutionSchema = new mongoose.Schema({
  solutionID: {
	  type: String,
	  unique: true,
	  required: [true, '\'solutionID\' is required.']
  },
  /*solutionSecret: {
	  type: String,
	  required: [true, '\'solutionSecret\' is required.']
},*/
  name: {
	  type: String,
	  unique: true,
	  required: [true, '\'name\' is required.']
  },
  domains: {
	  type: [{type: mongoose.SchemaTypes.Url}],
	  default: []
  },
  active: {
		type: Boolean,
		default: true
  },
/**
  * multiple
  * solution can contain multiple units or only 1
  */
  multiple: {
    type: Boolean,
    default: true
  },
  owner: { type: Schema.Types.ObjectId, ref: 'accounts' }
});

module.exports = SolutionSchema;
