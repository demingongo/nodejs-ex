var s = {
	services: {
		"dogma": {
			type: "factory",
			indexPath: "%novice.service_dir%/dogma.factory",
			arguments: {
				"novice_express": {
						type: "%db.type%",
						database: '%db.database%',
						options: {
							replset: {
								socketOptions : {
									keepAlive : 1
								}
							},
							server : {
								poolSize: 24, //only use 1 connection max
								socketOptions : {
									keepAlive : 120
								}
							}
						},
						modelsDir: "%db.models_dir%/dogma/mongoose"
				}
			}
		} 
	}
};

module.exports = s;