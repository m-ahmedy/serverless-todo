import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from 'src/utils/logger'
import { deleteTodoItem } from 'src/businessLogic/todos'

import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

const logger = createLogger('DeleteTodo')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)

  const todoId = event.pathParameters.todoId

  await deleteTodoItem(todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({ todoId })
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
