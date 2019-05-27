var title = "conf-management ProcessCharges (not async) Function (1): ";
function db(aMsg) {
    print("\n" + title + aMsg);
    log.debug(title + aMsg);
}
var title = "ProcessCharges Function - ";
try {    // persist payload
    var payload = req.json;
    db(title + "Running - good place to alter payload for more complex transformations than ExtProps" +
        "\n...req.json: " + payload);
    var postPayloadResponse = SysUtility.restPost(Config.settings.resourceURL + "/ProcessChargesResource",
                                    {ByPassAsync: true}, Config.settings.authHeader, payload);
    db(title + "postPayloadResponse: " + postPayloadResponse + "\n\n");
    return JSON.parse(postPayloadResponse);
} catch(e) {
    db (title + "post exception: " + e);
    throw title + "post exception: " + e;
}
