const AWS = require("aws-sdk");
const crypto = require("crypto");

// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");
// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

let counter = 1
let messageCount = 0
let funcId = 'id'+parseInt(Math.random()*1000)

exports.handler = async event => {

    var attributes = event.Records[0].messageAttributes;

    console.log("text: ", attributes.origin.stringValue);

    const params = {
      TableName: "exam1", // The name of your DynamoDB table
      Item: { // Creating an Item with a unique id and with the passed title
        id: generateUUID(),
         origin: attributes.origin.stringValue,
         type: attributes.type.stringValue,
         message: attributes.message.stringValue,
      }
    };
    try {
      // Utilising the put method to insert an item into the table (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01)
      const data = await documentClient.put(params).promise();
      const response = {
        statusCode: 200
      };
      return response; // Returning a 200 if the item has been inserted
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.parse(e)
      };
    }
};
