import AWS from 'aws-sdk';

export function call(action, param) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	return dynamoDb[action](param).promise();
}