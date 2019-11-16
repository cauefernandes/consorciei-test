var AWS = require('aws-sdk');
var sqs = new AWS.SQS({
    region: 'us-east-1'
});

exports.handler = function(event, context, callback) {
    var queueUrl = 'https://sqs.us-east-1.amazonaws.com/918810475415/exam1';

    var myBody = JSON.parse(event.body);
    var responseBody = {
    };
    var responseCode = 200;
    var msgparams;
    if(myBody.params!=undefined){
      msgparams = JSON.stringify(myBody.params)
    }
    else{
      msgparams = "null";
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
    },
    "params": {
      DataType: "String",
      StringValue: msgparams
    }
  },
        // MessageBody: event.body,
        MessageBody: 'testing',
        QueueUrl: queueUrl,
        DelaySeconds: 0
    };

    sqs.sendMessage(attributes, function(err, data) {
        if (err) {
            console.log('error:', "failed to send message" + err);
            var responseCode = 500;
            responseBody.status = false;
            responseBody.error = err;
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
