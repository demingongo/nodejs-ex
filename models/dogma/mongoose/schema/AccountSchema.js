var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Novice = require('novice');

//var solutionSchema = require("./SolutionSchema");

const ROLES = ["ROLE_USER", "ROLE_ADMIN"];
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#]{8,}/;

var AccountSchema = new mongoose.Schema({
  name: String,
  firstname: String,

  username: {
	  type: String,
	  unique: true,
    minlength: [6, '{PATH} must contain between 6 and 22 characters'],
    maxlength: [22,'{PATH} must contain between 6 and 22 characters'],
    trim: true,
	  required: [true, '\'username\' is required.']
  },
  password: {
    type: String,
    select: true,
    /*required: [function(){
      console.log("is required");
      console.log(this);
      return !this._id;
    }, '\'password\' is required.'],*/

    //match: [PASSWORD_REGEX, '{PATH} must contain 8 characters and at least 1 uppercase, 1 lowercase, 1 number, 1 special character.'],

  // my own required validator + pre save and pre update bc mongoose is f*cked up
  validate: {
      validator: function(v) {
          return (v instanceof String || typeof v === 'string') && v.length;
      },
      message: '{PATH} is required.'
  },
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, '\'email\' is required.'],
    unique: true,
    index: { unique: true }
  },
  photo: [ ],

  roles: {
    type: Array,
    default: ROLES[0],
    validate: {
        validator: function(v) {
            return Array.isArray(v) && v.every(function(value, index, array){
              return ROLES.indexOf(value) != -1;
            });
        },
        message: '{VALUE} are not valid {PATH}. Choice: ' + ROLES.toString()
    },
  },

  //solutions: [{ type: Schema.Types.ObjectId, ref: 'solutions' }],

  active: {
		type: Boolean,
		default: true
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AccountSchema.virtual('displayName').get(function () {
  return this.name && this.firstname ? (this.firstname + ' ' + this.name) : (this.username || this.email);
});

AccountSchema.virtual('solutions', {
  ref: 'solutions', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'owner' // is equal to `foreignField`
});

AccountSchema.methods.hasRole = function(r) {
  return Array.isArray(this.roles) && this.roles.indexOf(r) != -1;
};

AccountSchema.methods.getAllRoles = function() {
  return ROLES;
};

AccountSchema.methods.comparePassword = function(p) {
  if(!this.password || !this._id) return false;
  return Novice.getLastInit().getService('Crypto64').comparePasswords(p, this.password);
};

AccountSchema.methods.hashPassword = function() {
  if(!this.password) return false;
  this.password = Novice.getLastInit().getService('Crypto64').hashcode(this.password);
  return this.password;
};

// to return JSON with populated virtual attributes
//AccountSchema.options.toJSON = { virtuals: true };

// -- hooks --

AccountSchema.pre('save', function(next) {
  var err;

  /** pre-save -- password -- **/
  // if password ..., else Error
  if(this.password && typeof this.password === 'string'){

    // if password has been modified, hash before save
    if(this.isModified('password')){
      this.password = Novice.getLastInit().getService('Crypto64').hashcode(this.password);
    }

  }
  else{
    err = new Error('password is required');
    err.name = "PreSaveValidatorError";
    err.errors = { password: { message: "'password' is required.", name: "PreSaveValidatorError", properties: {
     message:  "'password' is required.",
     path:"password",
     type:"required"
   }, kind: "required", path: "password" } };
   err.message = "accounts validation failed: password: 'password' is required.";
   err._message = "accounts validation failed";
  }
  /** END: pre-save -- password -- **/
  next(err);
});

AccountSchema.pre('update', function() {
  var data = { updatedAt: new Date() };

  var password = this.getUpdate().password;
  if(password && typeof password === 'string'){
    data.password = Novice.getLastInit().getService('Crypto64').hashcode(password);
  }
  this.update({}, data);
});

AccountSchema.pre('findOneAndUpdate', function() {
  var data = { updatedAt: new Date() };

  var password = this.getUpdate().$set && this.getUpdate().$set.password ? this.getUpdate().$set.password : this.getUpdate().password;
  if(password && typeof password === 'string'){
    data.password = Novice.getLastInit().getService('Crypto64').hashcode(password);
  }
  this.findOneAndUpdate({}, data);
});

module.exports = AccountSchema;
