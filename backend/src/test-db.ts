import { testDatabaseConnection } from './database.ts'

testDatabaseConnection().catch((error) => {
  console.error('DynamoDB connection failed:', error)
  process.exitCode = 1
})