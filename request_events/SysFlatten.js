if (req.verb === 'POST') {
    var title = "conf-management - SysFlatten Req Event: ";
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc...
    }
    
    // json transform - flatten designate group by appending groupName to underlying properties
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('AppendGroups') ) {  // ProcessCharges ExtProp: { "AppendGroups": "Cost"}
        print("\n" + title + req.resourceName + " is group-appended (per extProps) - for groups: " + 
            extProps.AppendGroups + "\npayload: " + req.json);
        var debugMoved = [];
        var reqJsonObjArray = JSON.parse(json);
        print(title + "reqJsonObjArray: " + JSON.stringify(reqJsonObjArray));
        var reqJsonObj = reqJsonObjArray[0];  // TODO - deal with *each* obj, subObjs...
        print(title + "reqJsonObj: " + JSON.stringify(reqJsonObj));
        var groupName = extProps.AppendGroups;
        for  (var eachProp in reqJsonObj) {
            if (eachProp == extProps.AppendGroups) {  // TODO make this array, etc etc
                print(title + "collapsing: " + groupName);
                var groupValue = reqJsonObj[eachProp];
                for (var eachSubProp in groupValue) {
                    var flattenedPropName = eachSubProp + groupName;
                    reqJsonObj[flattenedPropName] = groupValue[eachSubProp];
                }
                delete reqJsonObj[eachProp];    
            }
        }
        json = JSON.stringify(reqJsonObj);
        print(title + "flattened json: " + json);
    }
}
