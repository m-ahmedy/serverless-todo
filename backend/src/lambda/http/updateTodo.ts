import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoItem } from 'src/businessLogic/todos'
import { createLogger } from 'src/utils/logger'

import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

const logger = createLogger('UpdateTodo')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)

  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const updatedItem = await updateTodoItem(updatedTodo, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedItem })
  }
})

handler.use([
  cors({
    credentials: true,
  } as any),
  warmup({
    isWarmingUp: e => e.source === 'serverless-plugin-warmup',
    onWarmup: e => "It's warm!"
  })
])