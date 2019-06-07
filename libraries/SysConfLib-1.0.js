var Config = {  // a common technique for name-spacing in JavaScipt
    created: new Date(),
    save: function save(aMkt) {
        Config.settings = aMkt;
        Config.modified = new Date();
        // print("SysConfLib Config'd: " + JSON.stringify(Config));
    },
    settings: {
        loadedBy: "ConfLib default settings",
        resourceURL: "http://localhost:8080/rest/default/conf-management/v1",
        authHeader: {
            'headers': {
                'Authorization': 'CALiveAPICreator AcctgToken:1'
            }
        },
        confOfferURL: "http://localhost:8080/rest/default/conf-offer/v1",
        confOfferAuthHeader: {
            'headers': {
                'Authorization': 'CALiveAPICreator AdminKey:1'
            }
        }
    }
};

print("\SysConfLib loaded: " + JSON.stringify(Config) + "\n");
