var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = require("./UserSchema");
var unitSchema = require("./UnitSchema");

var ArticleSchema = new mongoose.Schema({
  title: {
    type: String, default: "",
    //custom validator
    validate: {
      validator: function(v) {
        return !v.isEmpty();
      },
      message: '"{VALUE}" is not a valid {PATH}.'
    },
    required: [true, '\'title\' is required.']
  },
  description: {type: String, default: ""},
  details: {type: String, default: ""},
  slug: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  unit: { type: Schema.Types.ObjectId, ref: 'units' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
  updatedBy: [ { type: Schema.Types.ObjectId, ref: 'users' } ],
  updatableBy: [ String ],
});

module.exports = ArticleSchema;
