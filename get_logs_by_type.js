// Add required AWS SDK
const AWS = require('aws-sdk');
// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
    // Check if query string parameters exist in the Event and return 500 if not
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
    // Check if query string parameters has a Origin parameter and return 500 if not
    if (!(event.queryStringParameters.type)) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                status: false,
                message: `No Type in Query String: ${JSON.stringify(event.queryStringParameters)}`
            })
        };
        return response;

    }

    // Create parameters to be queried from DynamoDB based on query string parameters
    const params = {
        // Define DynamoDB table name
        TableName: "exam1",
        // Define the queried index name
        IndexName: "type",
        KeyConditionExpression: "#type = :type",
        ExpressionAttributeValues: {
            ":type": event.queryStringParameters.type
        },
        ExpressionAttributeNames: {
            "#type": "type"
        },
    };
    try {
        // Utilising the query method to get the items from DynamoDB based on the params const
        const data = await documentClient.query(params).promise();
        // Return a 200 if the query has been successfull or 500 if it failed
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
