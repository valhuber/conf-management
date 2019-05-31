var title = "conf-management - SysScalableQueueHijackReqEvent (reponse): ";
print("\n" + title + "start... byPassAsync: " +
    "\n... request  json: " + req.json +
    "\n... response json: " + JSON.stringify(json));

if (json.errorMessage.contains("Hijack")) {  // @see(SysScalableQueueReqEvent)
    json.hijacked = "Your request (which is very important to us) is posted to SystemQueue for SysTimerAsync";
    json.statusCode=201;
    delete json.message;
    delete json.errorCode;
    delete json.errorMessage;
}
