var title = "conf-management PullOffersTimer (1.1): ";

/*

Sometimes, source systems do not "push" data via APIs, or Messages.
So, we can write timers to "pull" changes, like this:

For eachConfOffer <svr>conf-offer/ManagementAlert, like(name:'%Pull%') since last-run
    // key pattern: read data in form for POSTing
    POST eachConfOffer <svr>/conf-management/v1/ProcessRequest  

TODO - since last-run
*/

try {
    var pullConfOfferURL = Config.settings.confOfferURL + "/ManagementAlert";
    var getParams = {sysfilter: "like(\"name\":" + JSON.stringify("%Pull Not Push%") + ")"};  // TODO and approved
    pulledOffersResponse = timerUtil.restGet(pullConfOfferURL , getParams, Config.settings.confOfferAuthHeader);
    print("\n" + title + "Wake-up, found: " + pulledOffersResponse);
} catch (e) {
    print("\n" + title + "EXCEPTION on wakeup: " + e);
}

var pulledOffers = JSON.parse(pulledOffersResponse); 
var postArrays = [];
for each (var eachPulledOffer in pulledOffers) {
    delete eachPulledOffer["@metadata"];
    postArrays = [];
    try {    // we have read data in POSTable format... do so!
        postArrays.push(eachPulledOffer);
        var postPayloadResponse = timerUtil.restPost(Config.settings.resourceURL + "/ProcessChargesResource",
                                                {}, Config.settings.authHeader, postArrays);
        print(title + "Payload POSTed to ProcessChargesResource (queued for async processing), postPayloadResponse: " + postPayloadResponse + "\n\n");
    } catch(e) {
        print (title + "post exception: " + e);
        throw title + "post exception: " + e;
    }
}
