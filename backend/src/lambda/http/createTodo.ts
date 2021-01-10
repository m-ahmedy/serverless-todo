import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodoItem } from '../../businessLogic/todos'
import { createLogger } from 'src/utils/logger'

const logger = createLogger('CreateTodo')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const item = await createTodoItem({ ...newTodo }, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item,
    })
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