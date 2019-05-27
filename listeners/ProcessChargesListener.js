var title = "conf-management ProcessChargesListener (1): ";
print(title + "Payload Received");
try {    // persist payload
    var postPayloadResponse = listenerUtil.restPost(Config.settings.resourceURL + "/ProcessChargesResource",
                                            {}, Config.settings.authHeader, JSON.parse(message));
    print(title + "Payload POSTed to ProcessChargesResource (queued for async processing), postPayloadResponse: " + postPayloadResponse + "\n\n");
} catch(e) {
    print (title + "post exception: " + e);
    throw title + "post exception: " + e;
}
