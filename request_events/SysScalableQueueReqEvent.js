if (req.verb === 'POST') {
    var title = "conf-management - SysScalableQueueReqEvent (3.1): ";
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc...
    }
   
    // on post to ProcessRequestResource, store json into SystemQueue, for async processing via timer
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('Async') ) {  // ProcessCharges ExtProp: { "Async": "SystemQueue"}
        var ttl = title + "ASYNC - QUEUE - ";
        var byPassAsync = req.urlParameters.ByPassAsync;
        print("\n" + ttl + "start... req.verb: " + req.verb + ", byPassAsync: " + byPassAsync + 
            "\n... json: " + json);
        print("\n ...isPost: " + (req.verb == "POST"));
        if (byPassAsync || req.verb !== "POST") {  // don't queue (let the request proceed)
            print(ttl + req.resourceName + " has ByPassAsync url arg, or is not POST");
        } else {
            var systemQueuePayload = {};
            systemQueuePayload.MsgContent = json;
            systemQueuePayload.PostToResource = req.resourceName;
            systemQueuePayload.ProcessedStatus = "ASYNC - QUEUED";
            var systemQueueURL = Config.settings.resourceURL + "/" + "SystemQueue";
            var persistToResponse = SysUtility.restPost(systemQueueURL, {}, Config.settings.authHeader, systemQueuePayload);
            print(ttl + req.resourceName + " is queued (per extProps): " +
                "\nurl: " + systemQueueURL + "\npayload: " + JSON.stringify(systemQueuePayload));
            print(ttl + "clearing json... response:\n" + persistToResponse);
            throw "terminate request... @see(SysScalableQueueHijackReqEvent";
        }
    }
}
