var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  if(process.env.DATABASE_SERVICE_NAME){
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD']
    mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
      mongoURLLabel = mongoURL = 'mongodb://';
      if (mongoUser && mongoPassword) {
        mongoURL += mongoUser + ':' + mongoPassword + '@';
      }
      // Provide UI label that excludes user id and pw
      mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
      mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    }
  }
  else{
    mongoURL = 'mongodb://127.0.0.1:27017/express';
  }
}

console.log(mongoURL);

var p = {
	parameters: {
		"db.type": "mongoose",
		"db.database": mongoURL,
		"db.models_dir": "%novice.project_dir%/models",

    "app.utils_dir": "%novice.project_dir%/utils",


		//"circular_ref": "throw error %circular_ref%",


		"secret_key": "flyyyyyyy",
    "crypto_salt": "abcdefghijklmnop"
	}
};

module.exports = p;
