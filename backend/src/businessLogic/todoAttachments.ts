import { TodoAttachmentsAccess } from '../dataLayer/todoAttachmentsAccess'

const todoAttachmentsAccess = new TodoAttachmentsAccess()

export function generateUploadUrl(todoId: string): string {
    return todoAttachmentsAccess.generateUploadUrl(todoId)
}
