// post row.MsgContent to row.PostToResource, using ByPassAsync (e.g., user adds missing Marketing Program, clicks RetryPayload)
var title = "conf-management SystemQueue - Retry From RetryPayload Function - Post MsgContent to PostToResource: ";
function db(aMsg) {
    print("\n" + title + aMsg);
    log.debug(title + aMsg);
}

db("Running, SystemQueue row: " + row.toString());
if (row.ProcessedStatus.startsWith("Retrying:")) {  // @see(Function RetryPayload)
    var resourceURL = req.localFullBaseURL + row.PostToResource;    // eg, ProcessChargesResource - mapping and transformation defined by Custom Resource
    db ("Posting to: " + row.PostToResource + ", url: " + resourceURL + ", via Config: " + JSON.stringify(Config) +
        "\n... row.MsgContent: " + row.MsgContent);
    var postResponse = SysUtility.restPost(resourceURL, {ByPassAsync: true}, Config.settings.authHeader, JSON.parse(row.MsgContent));
    db(title + "Post Response: " + postResponse);
    row.PostResponse = JSON.stringify(postResponse);
    row.ProcessedStatus = "Retried: " + new Date();
    logicContext.update(row);
}
