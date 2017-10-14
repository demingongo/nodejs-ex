var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = require("./UserSchema");
var solutionSchema = require("./SolutionSchema");

var UnitSchema = new mongoose.Schema({
  name: String,
  photo: [ ],
  details: {type: String, default: ""},
  active: {
		type: Boolean,
		default: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  solution: { type: Schema.Types.ObjectId, ref: 'solutions' }
},
{ toJSON: { virtuals: true } });

UnitSchema.index({ name: 1, solution: 1 }, { unique: true });

UnitSchema.virtual('users', {
  ref: 'users', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'unit' // is equal to `foreignField`
});

module.exports = UnitSchema;
