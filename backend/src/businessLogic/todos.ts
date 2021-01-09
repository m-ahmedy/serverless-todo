import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

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