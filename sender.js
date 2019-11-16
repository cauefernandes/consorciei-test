var AWS = require('aws-sdk');
var sqs = new AWS.SQS({
    region: 'us-east-1'
});

exports.handler = function(event, context, callback) {
    var queueUrl = 'https://sqs.us-east-1.amazonaws.com/918810475415/exam1';

    var myBody = JSON.parse(event.body);

    // response and status of HTTP endpoint
    var responseBody = {
        message: ''
    };
    var responseCode = 200;

    // SQS message parameters
    var params = {
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

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log('error:', "failed to send message" + err);
            var responseCode = 500;
        } else {
            console.log('data:', data.MessageId);
            responseBody.message = 'Sent to ' + queueUrl;
            responseBody.messageId = data.MessageId;
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
