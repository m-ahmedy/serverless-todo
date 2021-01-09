import 'source-map-support/register'

import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl } from 'src/businessLogic/todoAttachments'
import { updateAttachmentUrl } from 'src/businessLogic/todos'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const uploadUrl = generateUploadUrl(todoId)
  await updateAttachmentUrl(todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
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
