
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// test
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-north-1',
})

export const db = DynamoDBDocumentClient.from(client)


// test
export async function testDatabaseConnection() {
	const result = await client.send(
	  new DescribeTableCommand({ TableName: tableName })
	)

	console.log('Connected to DynamoDB:', result.Table?.TableName)
	console.log('Key schema:', result.Table?.KeySchema)
}

export const tableName = 'chatbot-gemini'
