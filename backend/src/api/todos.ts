import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { getUserId } from '../lambda/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { databaseService, storageService } from '../service'

export const createTodo = async (
  event: APIGatewayProxyEvent,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> => {
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const createdAt = new Date(Date.now()).toISOString()

  const todoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: `https://${storageService.getBucketName()}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest
  }

  await databaseService.createTodo(todoItem)

  return todoItem
}

export const deleteTodo = async (
  event: APIGatewayProxyEvent
): Promise<boolean> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  if (!(await databaseService.getTodo(todoId, userId))) {
    return false
  }

  await databaseService.deleteTodo(todoId, userId)

  return true
}

export const getTodo = async (
  event: APIGatewayProxyEvent
): Promise<TodoItem> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  return await databaseService.getTodo(todoId, userId)
}

export const getTodos = async (
  event: APIGatewayProxyEvent
): Promise<TodoItem[]> => {
  const userId = getUserId(event)

  return await databaseService.getAllTodos(userId)
}

export const updateTodo = async (
  event: APIGatewayProxyEvent,
  updateTodoRequest: UpdateTodoRequest
): Promise<boolean> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  if (!(await databaseService.getTodo(todoId, userId))) {
    return false
  }

  await databaseService.updateTodo(todoId, userId, updateTodoRequest)

  return true
}

export const generateUploadUrl = (event: APIGatewayProxyEvent): string => {
  const bucket = storageService.getBucketName()
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  const todoId = event.pathParameters.todoId

  const createSignedUrlRequest = {
    Bucket: bucket,
    Key: todoId,
    Expires: urlExpiration
  }

  return storageService.getPresignedUploadURL(createSignedUrlRequest)
}
