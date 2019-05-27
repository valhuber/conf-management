if (req.verb === 'POST') {
    var title = "conf-management - SysAudit Req Event (3a): ";
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc...
    }

    // save payload to designated resource, e.g. for error recovery
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('PersistTo') ) {  // ProcessCharges ExtProp: { "PersistTo": "PersistCharges"}
        var persistToResponse = SysUtility.restPost(Config.settings.resourceURL + "/" + extProps.PersistTo, {}, Config.settings.authHeader, {MsgContent: JSON.stringify(req.json)});
        print("\n" + title + req.resourceName + " was audited (per extProps) - persisting as separate transaction: " + "\nurl: " + Config.settings.resourceURL + "/" + extProps.PersistTo + "\npayload: " + JSON.stringify({MsgContent: req.json}));
    }
}
