
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {

  if (!("queryStringParameters" in event) || !(event.queryStringParameters)) {
      return {
        statusCode: 404,
        error: `No pathParameters`
      };
    }
    if (!(event.queryStringParameters.type)) {
      return {
        statusCode: 404,
        error: `No origin in Query String: ${JSON.stringify(event.queryStringParameters)}`
      };
    }


  const params = {
    TableName: "exam1",
   IndexName: "type",
    KeyConditionExpression: "#type = :type",
    ExpressionAttributeValues: {
        ":type": event.queryStringParameters.type
    },
    ExpressionAttributeNames: { "#type": "type" },
  };
  try {
const data = await documentClient.query(params).promise();
       const response = {
        statusCode: 200,
        body: JSON.stringify(data.Items)
      };
      return response;
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify(e)
      };
    }
};
