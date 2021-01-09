import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'

import { createLogger } from '../utils/logger'

const logger = createLogger('TodoAttachmentsAccess')
export class TodoAttachmentsAccess {
    constructor(
        private readonly s3Client: S3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly attachmentsBucket = process.env.TODO_ATTACHMENTS_S3_BUCKET,
        private readonly urlExpiration = process.env.URL_EXPIRATION,
    ) { }

    generateUploadUrl(todoId: string): string {
        logger.info('Generating upload url for image with ID: ', todoId)

        return this.s3Client.getSignedUrl('putObject', {
            Bucket: this.attachmentsBucket,
            Key: todoId,
            Expires: parseInt(this.urlExpiration),
        })
    }
}