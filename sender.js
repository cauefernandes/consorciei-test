var AWS = require('aws-sdk');
var sqs = new AWS.SQS({
    region: 'us-east-1'
});

exports.handler = function(event, context, callback) {
    var queueUrl = 'https://sqs.us-east-1.amazonaws.com/918810475415/exam1';
    var myBody = JSON.parse(event.body);
    var responseBody = {};
    var responseCode = 200;


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


    // SQS message parameters
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
        // MessageBody: event.body,
        MessageBody: 'testing',
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    if (myBody.params) {
        attributes.MessageAttributes.params = {
            DataType: "String",
            StringValue: JSON.stringify(myBody.params)
        }
    }


    sqs.sendMessage(attributes, function(err, data) {

        if (err) {
            console.log('error:', "failed to send message" + err);
            var responseCode = 500;
            responseBody.status = false;
            responseBody.message = err;
        } else {
            console.log('data:', data.MessageId);
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
