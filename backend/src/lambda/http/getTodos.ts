import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodos } from '../../businessLogic/todos'

import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GetTodos')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)

  const userId = getUserId(event)
  const todos = await getTodos(userId)
  logger.info('Items: ', todos)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos,
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
