var tests = [  // titles of tests to run (ok to alter, appears in reponse to explain what tests were run)
    "Synchronous Post (via ProcessCharges function)",  // none of these tests require the listener
    "Scalable    Post (via ProcessChargesResource (per Req Events / Ext Props > SystemQueue > Timer + RetryProces function)",
    "Scalable    Post (via ProcessChargesResource (per Req Events / Ext Props > SystemQueue > Timer + RetryProces function) !!Intentional Error",
    "System Queue Error Correction (via SystemQueue async event)"
];


var title = "conf-mgmt testAll Function: ";
function db(aMsg) {
    print("\n" + title + aMsg);
    log.debug(title + aMsg);
}


function postOffer(anOffer, aResourceName) {
    try {    // persist payload
        var postPayloadResponse = SysUtility.restPost(Config.settings.resourceURL + "/" + aResourceName,
                                        {}, Config.settings.authHeader, anOffer);
        db(title + "postPayloadResponse: " + postPayloadResponse + "\n\n");
        return JSON.parse(postPayloadResponse);
    } catch(e) {
        db (title + "post exception: " + e);
        throw title + "post exception: " + e;
    }
}


function getRowCount(aResourceName) {
    var getPayloadResponse = SysUtility.restGet(Config.settings.resourceURL + "/" + aResourceName,
                                        {}, Config.settings.authHeader);
    // db(title + "length(" + aResourceName + ")... getPayloadResponse: " + getPayloadResponse);
    var responseObj = JSON.parse(getPayloadResponse);
    return responseObj.length;
}


function getLastRow(aResourceName) {
    var getPayloadResponse = SysUtility.restGet(Config.settings.resourceURL + "/" + aResourceName,
                                        {}, Config.settings.authHeader);
    // db(title + "length(" + aResourceName + ")... getPayloadResponse: " + getPayloadResponse);
    var responseObj = JSON.parse(getPayloadResponse);
    return responseObj[responseObj.length-1];
}

function isQueueEnabledInProcessCharges() {
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor("ProcessChargesResource");
    } catch(e) {
        // occurs for non-resources, etc...
    }
    // see if we are using Async
    print (title + "isQueueEnabledInProcessCharges, extProps: " + JSON.stringify(extProps));
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('Async') )  {
        asyncValue = extProps.Async + "";
        return asyncValue.contains("Enabled");  
    }
    return false;
}



// ************************ Execution begins here - configure
var isQueueEnabled = isQueueEnabledInProcessCharges();   // false bypasses queue-dependent tests

// setup

var messages = [];
var errorCount = 0;
var Thread = Java.type('java.lang.Thread');
var testName = "testAll";
var sysQueueCount = 0;
var sysChargesCount = 0;
var sysQueueCountAfter = 0;
var sysChargesCountAfter = 0;
var chargesCount = getRowCount("Charges");
var restResult = {};
var result = "";
var testData =
[
  {
    "name": "testAll",
    "unusedAttribute": "deleteMe",
    "Cost": {
        "Exhibits": 1,
        "Talks": 2
    },
    "MarketingProgramName": "Agile",
    "Talks_List": [
    ]
  }
];


/* ************************************************************************
** Synchronous Post (via ProcessCharges function)
** ************************************************************************ */
testName = tests[0];
sysQueueCount = getRowCount("SystemQueue");
db (title + "sysQueueCount: " + sysQueueCount);
chargesCount = getRowCount("Charges");
db (title + "chargesCount: " + chargesCount);

testData[0].name = "testAll - " + testName;
restResult = postOffer(testData, "ProcessCharges");  // this is the function, which uses arg bypassAsync

sysQueueCountAfter = getRowCount("SystemQueue");
db (title + "sysQueueCount: " + sysQueueCountAfter);
chargesCountAfter = getRowCount("Charges");
db (title + "chargesCount: " + chargesCountAfter);
result = "Success - " + testName;
if (chargesCount + 1 !== chargesCountAfter) {
    errorCount += 1;
    result = "FAILURE: Charge not created from PostCharges";
}
if (sysQueueCount !== sysQueueCountAfter) {
    errorCount += 1;
    result = "FAILURE: Sytem Queue wrongly created from PostCharges";
}
messages.push(result);    
chargesCount = chargesCountAfter;  // reset counts for next test
sysQueueCount = sysQueueCountAfter;


/* ************************************************************************
** Scalable    Post (via ProcessChargesResource (per Req Events / Ext Props > SystemQueue > Timer + RetryProces function)
** ************************************************************************/
testName = tests[1];
result = "Success - " + testName;
try {
    testData[0].name = "testAll - " + testName;
    restResult = postOffer(testData, "ProcessChargesResource");  // this is queued, and then processed by timer
} catch (e) {
    db("EXCEPTION in: " + testName + ":: " + e);  // ignore FIXME
    messages.push("...excp - " + testName + ":: " + e);
}

Thread.sleep(10000);  // wait for the timer

sysQueueCountAfter = getRowCount("SystemQueue");
db (title + "sysQueueCount: " + sysQueueCount);
chargesCountAfter = getRowCount("Charges");
db (title + "chargesCount: " + chargesCount);
result = "Success - " + testName;
if (chargesCount + 1 !== chargesCountAfter) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: Charge not created from PostChargesResource (is the timer really running?)";
}
if (isQueueEnabled && (sysQueueCount + 1 !== sysQueueCountAfter)) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: System Queue not created from PostChargesResource (is the timer really running?)";
}
messages.push(result);
chargesCount = chargesCountAfter;  // reset counts for next test
sysQueueCount = sysQueueCountAfter;



/* ************************************************************************
** "Scalable    Post (via ProcessChargesResource (per Req Events / Ext Props > SystemQueue > Timer + RetryProces function) !!Intentional Error";
** ************************************************************************ */
testName = tests[2];
result = "Success - " + testName;
try {
    testData[0].name = "testAll - " + testName;
    testData[0].MarketingProgramName += "BAD-DATA"; // cause intentional failure
    restResult = postOffer(testData, "ProcessChargesResource");  // this is queued, and then processed by timer
} catch (e) {
    db("EXCEPTION in: " + testName + ":: " + e);  // ignore FIXME
    messages.push("...excp - " + testName + ":: " + e);
}

Thread.sleep(10000);  // wait for the timer

sysQueueCountAfter = getRowCount("SystemQueue");
db (title + "sysQueueCount: " + sysQueueCount);
chargesCountAfter = getRowCount("Charges");
db (title + "chargesCount: " + chargesCount);
result = "Success - " + testName;
if (chargesCount !== chargesCountAfter) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: Charge wrongly created from PostChargesResource (is the timer really running?)";
}
if (isQueueEnabled && ( sysQueueCount + 1 !== sysQueueCountAfter)) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: " + sysQueueCount + "=>" + sysQueueCountAfter + " System Queue not created from PostChargesResource (is the timer really running?)";
}
messages.push(result);
chargesCount = chargesCountAfter;  // reset counts for next test
sysQueueCount = sysQueueCountAfter;



/* ************************************************************************
** System Queue Error Correction (via SystemQueue async event)
** ************************************************************************ */
testName = tests[3];
result = "Success - " + testName;

try {
    db(title + testName + ", restResult: " + JSON.stringify(restResult));
    var lastRow = getLastRow("SystemQueue");
    db(title + testName + ", lastRow: " + JSON.stringify(lastRow));
    lastRow.MsgContent = lastRow.MsgContent.replace("BAD-DATA", "");
    lastRow.ProcessedStatus = "manual retry";
    db(title + testName + ", corrected lastRow: " + JSON.stringify(lastRow));
    var retryErrorResponse = SysUtility.restPut(Config.settings.resourceURL + "/" + "SystemQueue",
                                {}, Config.settings.authHeader, lastRow);
    db(title + testName + ", retryErrorResponse: " + retryErrorResponse);
} catch (e) {
    db("EXCEPTION in: " + testName + ":: " + e);  // ignore FIXME
    messages.push("...excp - " + testName + ":: " + e);
}

Thread.sleep(1000);  // wait for the timer

sysQueueCountAfter = getRowCount("SystemQueue");
db (title + "sysQueueCount: " + sysQueueCount);
chargesCountAfter = getRowCount("Charges");
db (title + "chargesCount: " + chargesCount);
result = "Success - " + testName;
if (chargesCount + 1  !== chargesCountAfter) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: " + sysQueueCount + "=>" + sysQueueCountAfter + " Charge not created from corrected SystemQueue";
}
if ( sysQueueCount !== sysQueueCountAfter) {
    errorCount += 1;
    result = "FAILURE: " + testName + ":: " + sysQueueCount + "=>" + sysQueueCountAfter + " System Queue wrongly created from corrected SystemQueue";
}
messages.push(result);
chargesCount = chargesCountAfter;  // reset counts for next test
sysQueueCount = sysQueueCountAfter;

testResult = 201;
if (errorCount > 0)
    testResult = 400;
return {statusCode: testResult, isQueueEnabled: isQueueEnabled, messages: messages};

