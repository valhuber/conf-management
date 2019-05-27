if (req.verb === 'POST') {
    var title = "conf-management - SysIgnoreUnused Req Event (3a): ";
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc...
    }
    
    // ignore cols not in meta data (note: simpler approach is to use req.setUserProperty("IgnoreExtraAttributes", "NonNullValue");... this illustrates utilizing metadata)
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('IgnoreColumns') ) {  // ProcessCharges ExtProp: { "PersistTo": "PersistCharges"}
        print("\n" + title + req.resourceName + " is designated (per extProps) - to ignore unused columns: " +
            "\n...payload: " + JSON.stringify(req.json));
        var resourcesString = SysUtility.restGet(Config.settings.resourceURL + "/@resources",
                                            {}, Config.settings.authHeader);
        var resources = JSON.parse(resourcesString);
        var resourceID = 0;
        for each (var eachResource in resources) {  // find the ident of 'me'
            if (eachResource.name === req.resourceName) {
                resourceID = eachResource.ident;
                break;
            }
        }
        if (resourceID === 0)
            throw "unable to find metadata for resource: " + req.resourceName;
        var url = Config.settings.resourceURL + "/@resources/" + resourceID;
        var resourceDefAsString = SysUtility.restGet(Config.settings.resourceURL + "/@resources/" + resourceID, {}, Config.settings.authHeader);
        var resourceDef = JSON.parse(resourceDefAsString);
        var resourceAttributes = resourceDef.attributes;
        print(title + "resourceAttributes: " + JSON.stringify(resourceAttributes));
        
        var debugMoved = [];
        var reqJsonObjArray = JSON.parse(req.json);
        print(title + "reqJsonObjArray: " + JSON.stringify(reqJsonObjArray));
        var reqJsonObj = reqJsonObjArray[0];  // TODO - should really deal with each obj, subObjs...
        print(title + "reqJsonObj: " + JSON.stringify(reqJsonObj));
        for  (var eachProp in reqJsonObj) { 
            var isDefinedAttr = false;
            // print(title + "eachProp: " + eachProp);
            for each (var eachResourceAttribute in resourceAttributes) {
                if (eachProp == eachResourceAttribute.name) {
                    isDefinedAttr = true;
                    break;
                }
            }
            if ( isDefinedAttr ) { // wanted: resourceAttributes.findIndex(isAttribute) ) {
                debugMoved.push(eachProp);
            } else {
                print(title + "deleting attribute: " + eachProp);
                delete reqJsonObj[eachProp];
            }
          }
        var prunedJson = JSON.stringify(reqJsonObj);
        print(title + "prunedJson: " + prunedJson);
        json = prunedJson;  // system will process this altered json
        req.json = JSON.stringify(json);
        print(title + "copyAttributes - moved: [" + debugMoved + "]" +
            "\n...revised req: " + JSON.stringify(json));
    }
}
