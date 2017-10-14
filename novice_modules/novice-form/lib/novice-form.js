
var path = require('path');

var form = exports = module.exports = {};


form.handleRequest = function handleRequest(request, entity, schema){
		if (typeof schema == "undefined") {
			for (property in request) {
				entity[property] = request[property];	
			}
		}
		else{
			var paths = schema.paths;
			for (property in request) {
				if (typeof paths[property] != "undefined") {
					entity[property] = request[property];
				}	
			}
		}

		return entity;
};

form.getModel = function getModel(model, error){

	var mv = {
		form:
		{
			model: {},
			errors: {},
		}
	};

	if (typeof model != "undefined" && model != null) {
		mv.form.model = model;
	}

	if (typeof error != "undefined" && error != null) {
		// if it's an error object coming from validationSync of mongoose
		if(error.name == "ValidationError" && typeof error.errors == "object"){
			mv.form.errors = error.errors;

			mv.form.errors.get = function(param){
				if(typeof mv.form.errors[param] != "undefined")
					return mv.form.errors[param].message;
				};	
		}
		else{
			mv.form.errors = error;
			
			mv.form.errors.get = function(param){
				if(typeof mv.form.errors[param] != "undefined")
					return mv.form.errors[param];
				};
		}		
	}
	else{
		mv.form.errors.get = function(){};
	}

	return mv;
};