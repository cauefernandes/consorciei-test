
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {

  if (!("queryStringParameters" in event) || !(event.queryStringParameters)) {
      return {
        statusCode: 404,
        error: `No pathParameters`
      };
    }
    if (!(event.queryStringParameters.origin)) {
      return {
        statusCode: 404,
        error: `No origin in Query String: ${JSON.stringify(event.queryStringParameters)}`
      };
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
