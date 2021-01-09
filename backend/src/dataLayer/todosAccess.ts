import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from 'src/requests/UpdateTodoRequest'

import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const logger = createLogger('TodoAccess')
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly attachmentsBucket = process.env.TODO_ATTACHMENTS_S3_BUCKET,
        private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX
    ) { }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todo Items of user with ID: ', userId)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosByUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items

        logger.info(`Found ${items.length} todos for user ${userId} in ${this.todosTable}`)

        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating a todo Item with ID: ', todoItem.todoId)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async deleteTodo(todoId: string) {
        logger.info(`Deleting the todo with ID: ${todoId}`)

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId
            }
        }).promise()

        return {
            todoId
        }
    }

    async updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string) {
        logger.info('Updating the todo with ID: ', todoId)

        const { done, dueDate, name } = updateTodoRequest
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": name,
                ":dueDate": dueDate,
                ":done": done
            }
        }).promise()

        return
    }

    async updateAttachmentUrl(todoId: string) {
        logger.info(`Updating attachment URL for todo ${todoId}`)

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${this.attachmentsBucket}.s3.amazonaws.com/${todoId}`
            }
        }).promise()

        return
    }
}