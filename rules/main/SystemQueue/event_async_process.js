// retry if user correct error and presses save, or manually posts a SystemQueue row
// improve response time, by putting longer processing into async events

var title = "conf-management SystemQueue - Retry From MsgContent Change - Async (response time) Post MsgContent: ";
function db(aMsg) {
    var theMsg = aMsg;
    if (theMsg.startsWith("\n")) {
        print("\n");
        log.debug("\n");
        theMsg = theMsg.substring(1);
    }
    print(title + theMsg);
    log.debug(title + aMsg);
}

db("\n" + title + "Running, SystemQueue \n...row: " + row.toString());
if (row.ProcessedStatus.startsWith("ASYNC -")  || row.ProcessedStatus.startsWith("Processed:")) { // row.ProcessedStatus = "Processed: "
    db("...Running, bypassed per 'ASYNC - '...");
} else {
    var isInsert = false;
    if (typeof oldRow === 'undefined')
        isInsert = true;
    db("Running.   row.ProcessedStatus: " + row.ProcessedStatus + ", isInsert: " + isInsert);
    if (isInsert || row.MsgContent !== oldRow.MsgContent) {
        var resourceURL = req.localFullBaseURL + row.PostToResource;    // eg, ProcessChargesResource - mapping and transformation defined by Custom Resource
        if (row.MsgContent.startsWith("<"))
            settings.headers["Content-Type"] = "application/xml";       // not required if strictly JSON
        db ("Posting to: " + resourceURL + ", with Config: " + JSON.stringify(Config));
        try {
            var postResponse = SysUtility.restPost(resourceURL, {ByPassAsync: true}, Config.settings.authHeader, JSON.parse(row.MsgContent));
        } catch (e) {
            db("Exception in " + title + ", e: " + e);
        }
        db(title + "Post Response: " + postResponse);
    } else {
        db("not saving");
    }
}
