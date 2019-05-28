var title = "conf-management PullOffersTimer: ";

/*

Sometimes, source systems do not "push" data via APIs, or Messages.
So, we can write timers to "upp" changes, like this:

For eachConfOffer <svr>conf-offer/ManagementAlert, like(name:'%Pull%') since last-run
    // key pattern: read data in form for POSTing
    POST eachConfOffer <svr>/conf-management/v1/ProcessRequest  

@see(Function RetryPayload)
Consider - timerRun as optional parent
*/

var timerWakeupSystemQueueURL = Config.settings.resourceURL + "/main:SystemQueue";
var getParams = {sysfilter: "equal(\"ProcessedStatus\":" + JSON.stringify("ASYNC - QUEUED") + ")"};  // TODO and since some date
qItemsResponse = timerUtil.restGet(timerWakeupSystemQueueURL , getParams, Config.settings.authHeader);  // TODO - doc - SysUtil silent failure
print("\n" + title + "Wake-up, found: " + qItemsResponse);

var qItems = JSON.parse(qItemsResponse);  
for each (var eachQItem in qItems) {
    print(title + "eachQItem: " + JSON.stringify(eachQItem));
    eachQItem.ProcessedStatus = "ASYNC - CLAIM";
    print(title + "setInProgress: " + JSON.stringify(eachQItem));
    var setInProgressResponse = timerUtil.restPut(timerWakeupSystemQueueURL,
                                            {}, Config.settings.authHeader, JSON.stringify(eachQItem));
    print(title + "setInProgressResponse: " + setInProgressResponse);
    var unclaimed = true;  // TODO - check for optLock exception (another cluster node claimed it)
    if (unclaimed) {
        try {    // persist payload using function: http://localhost:8080/rest/default/conf-management/v1/"main:SystemQueue"/[pk]/RetryPayload
            var timerWakeupProcessingSystemQueueURL = timerWakeupSystemQueueURL + 
                "/" + eachQItem.Ident + "/RetryPayload";
            print(title + "ASYNC - PROCESSING.. URL: " + timerWakeupProcessingSystemQueueURL);
            var asyncProcessResponse = timerUtil.restGet(timerWakeupProcessingSystemQueueURL, {}, Config.settings.authHeader);
            print(title + "ASYNC - PROCESSING.. asyncProcessResponse: " + asyncProcessResponse + "\n\n");
        } catch(e) {
            print (title + "post exception: " + e);
            throw title + "post exception: " + e;
        }
        // TODO - update Q with status
    }
}
