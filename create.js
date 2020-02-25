import uuid from 'uuid';
import AWS from 'aws-sdk';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';


const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v4(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }

  dynamoDB.put(params, (error, data) => {
    // Set response headers to enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };

    // Return status code 500 on error
    if (error) {
      const response = {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: false,
        }),
      };
      callback(null, response);
      return;
    }
    // Return status code 200 and add the created item
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
}
