// Add required AWS SDK
var AWS = require('aws-sdk');
// Initialising the SQS SDK
var sqs = new AWS.SQS({
    region: 'us-east-1'
});

exports.handler = function(event, context, callback) {
    // Define SQS Queue URL
    var queueUrl = 'https://sqs.us-east-1.amazonaws.com/918810475415/exam1';
    // Get and parse the Request body
    var myBody = JSON.parse(event.body);
    // Define variables for use in the response
    var responseBody = {};
    var responseCode = 200;

    // Check if the passed type is one of the four accepted types (log, warn, error or custom)
    if (myBody.type != "log" && myBody.type != "warn" && myBody.type != "error" && myBody.type != "custom") {
        responseCode = 500;
        responseBody.status = false;
        responseBody.message = "Invalid log type - accepted type(log,warn,error,custom)";
        var response = {
            statusCode: responseCode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        };
        callback(null, response);
    }


    // Create the SQS message attributes from myBody variable
    var attributes = {
        MessageAttributes: {
            "origin": {
                DataType: "String",
                StringValue: myBody.origin
            },
            "type": {
                DataType: "String",
                StringValue: myBody.type
            },
            "message": {
                DataType: "String",
                StringValue: myBody.message
            }
        },
        MessageBody: 'Create SQS Log',
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    // Check if params was passed in the request and add it to the MessageAttributes
    if (myBody.params) {
        attributes.MessageAttributes.params = {
            DataType: "String",
            StringValue: JSON.stringify(myBody.params)
        }
    }

    // Call the SQS send message function
    sqs.sendMessage(attributes, function(err, data) {
    // Return 500 if fail to send message, otherwise, return 200 with status:True
        if (err) {
            console.log('error:', "failed to send message" + err);
            var responseCode = 500;
            responseBody.status = false;
            responseBody.message = err;
        } else {

            responseBody.status = true;
        }
        var response = {
            statusCode: responseCode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        };

        callback(null, response);
    });

}
