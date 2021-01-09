import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const logger = createLogger('TodoAccess')
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly attachmentsBucket = process.env.TODO_ATTACHMENTS_S3_BUCKET,
    ) { }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all Todo Items')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            ScanIndexForward: false,
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating a Todo Item with ID ', todoItem.todoId)

        const item = {
            ...todoItem,
            attachmentUrl: `https://${this.attachmentsBucket}.s3.amazonaws.com/${todoItem.todoId}`
        }

        await this.docClient.put({
            TableName: this.todosTable,
            Item: item
        }).promise()

        return item
    }
}