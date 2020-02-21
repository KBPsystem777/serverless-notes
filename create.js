import uuid from 'uuid'
import AWS from 'aws-sdk'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

export function main (event, context, callback) {
    // To do

    const data = JSON.parse(event.body)

    const parameters = {
        TableName: process.env.tableName,

        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v4(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    }

    dynamoDB.put(parameters, (error, data) => {
        // Set response headers to enable CORS
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        }

        // Return status code 500 on error
        if(error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({
                    status: false
                })
            }
            callback(null, response)
            return
        }
        // Return status code 200 and add the created item
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify( parameters.Item)
        }
        callback(null, response)
    })
}