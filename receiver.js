// Add required AWS SDK
const AWS = require("aws-sdk");
// Add required crypto
const crypto = require("crypto");

// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");
// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
    // Get message attributes from SQS message
    var attributes = event.Records[0].messageAttributes;

    // Create parameters to be added to DynamoDB based on Message Attribute values
    const params = {
        // Define DynamoDB table name
        TableName: "exam1",
        Item: {
            id: generateUUID(),
            origin: attributes.origin.stringValue,
            type: attributes.type.stringValue,
            message: attributes.message.stringValue,
            timestamp: new Date().getTime()
        }
    };

    // Check if params was added to the message and add it to the Items to be added to DynamoDB
    if (attributes.params) {
        params.Item.params = [attributes.params.stringValue]

    }

    try {
        // Utilising the put method to insert an item into the table
        const data = await documentClient.put(params).promise();
        // Return a 200 if the item has been inserted or 500 if it failed
        const response = {
            statusCode: 200
        };
        return response;
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.parse(e)
        };
    }
};
