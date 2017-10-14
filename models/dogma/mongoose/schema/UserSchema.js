var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var unitSchema = require("./UnitSchema");

const ROLES = ["VIEWER", "USER", "ADMIN"];

var UserSchema = new mongoose.Schema({
  name: String,
  firstname: String,

  username: {
	  type: String,
	  //unique: true,
	  required: [true, '\'username\' is required.']
  },
  password: {type: String, required: [true, '\'password\' is required.']},

  emails: [ ],
  photo: [ ],
  details: {type: String, default: ""},

  unit: { type: Schema.Types.ObjectId, ref: 'units' },

  roles: {
    type: Array,
    default: ROLES[0],
    validate: {
        validator: function(v) {
            return Array.isArray(v) && v.every(function(value, index, array){
              return ROLES.indexOf(value) != -1;
            });
        },
        message: '{VALUE} are not valid {PATH}. Valid {PATH}: ' + ROLES.toString()
    },
  },

  active: {
		type: Boolean,
		default: true
  },

  custom: {
		type: Object
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.virtual('displayName').get(function () {
  return this.name && this.firstname ? (this.firstname + ' ' + this.name) : (this.username || this.email);
});

UserSchema.methods.hasRole = function(r) {
  return Array.isArray(this.roles) && this.roles.indexOf(r) != -1;
};

UserSchema.methods.getAllRoles = function() {
  return ROLES;
};

UserSchema.index({ username: 1, unit: 1 }, { unique: true });

module.exports = UserSchema;
