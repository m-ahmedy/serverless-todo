import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from 'src/requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodos(userId)
}

export async function createTodoItem(
    createTodoItemRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()

    return await todosAccess.createTodo({
        todoId,
        userId,
        createdAt,
        done: false,
        ...createTodoItemRequest
    })
}

export async function deleteTodoItem(
    todoId: string,
) {
    return await todosAccess.deleteTodo(todoId)
}

export async function updateTodoItem(
    createTodoItemRequest: UpdateTodoRequest,
    todoId: string
) {
    return await todosAccess.updateTodo(createTodoItemRequest, todoId)
}

export async function updateAttachmentUrl(todoId: string) {
    return await todosAccess.updateAttachmentUrl(todoId)
}