var s = {
	services: {
		"class.service.test": {
			type: "class",
			arguments : [
				4,
				6,

				"%secret_key%",
				"%db.type%",
				'%db.database%',
				"%novice.service_dir%",
			]
		},
		"Crypto64":{
			type: "factory",
			indexPath: "%novice.service_dir%/crypto64.service/crypto64",
			arguments: {
				secretKey: "%secret_key%",
				"salt": "%crypto_salt%"
			}
		},
		"sha256":{
			indexPath: "crypto-js/sha256"
		},
	}
};

module.exports = s;
