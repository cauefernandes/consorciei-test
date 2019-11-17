const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {

    if (!("queryStringParameters" in event) || !(event.queryStringParameters)) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                status: false,
                message: 'No Query String Parameters defined'
            })
        };
        return response;
    }
    if (!(event.queryStringParameters.origin)) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                status: false,
                message: `No Origin in Query String: ${JSON.stringify(event.queryStringParameters)}`
            })
        };
        return response;

    }

    const params = {
        TableName: "exam1",
        IndexName: "origin",
        KeyConditionExpression: "origin = :origin",
        ExpressionAttributeValues: {
            ":origin": event.queryStringParameters.origin
        }
    };
    try {
        const data = await documentClient.query(params).promise();

        var responseBody = {};
        responseBody.status = true;
        responseBody.body = data.Items;
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        };
        return response;
    } catch (e) {
        responseBody.status = false;
        responseBody.message = e;
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        };
        return response;

    }
};
