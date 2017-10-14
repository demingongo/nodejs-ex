var RouteCollection = require("novice").routeCollectionClass();

module.exports = {



    collection1: { prefix: "/", resource: "index" },

    //localFun: new RouteCollection("/fun", "fun"),
	  //collection2: { prefix: "/dev", resource: "dev/resetdb" },
    //collection3: { prefix: "/dev", resource: "dev/dogmatests" },
    security: { resource: "security/index"},

    public: { prefix: "/api/public", resource: "public"},

    //allApi: new RouteCollection("/api", "api/all"),
    //api: new RouteCollection("/api", "api/authentication"),
    //apiUsers: new RouteCollection("/api/users", "api/users"),

    //adminProfile: new RouteCollection("/admin/accounts", "admin/accounts"),
    OuterHaven: new RouteCollection("/outerhaven", "oh"),
    OuterHavenAlias: new RouteCollection("/oh", "oh")
};
