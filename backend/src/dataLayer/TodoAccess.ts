import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import { TodoUpdate } from '../models/TodoUpdate'


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.Todos_Table) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }

  async deleteTodo(todoId: string, event:APIGatewayProxyEvent){
      const response = await this.docClient.delete({
          TableName: this.todoTable,
          Key:{
              userId: getUserId(event),
              todoId: todoId
          }
      }).promise()

      return response

  }

  async updateTodo(todoId:string, userId:string, updateItem: TodoUpdate){
      await this.docClient.update({
          TableName: this.todoTable,
          Key:{
              'userId': userId,
              'todoId': todoId
          },
          UpdateExpression: 'set name= :name, dueDate= :dueDate, done= :done',
          ExpressionAttributeValues:{
              ':name': updateItem.name,
              ':dueDate': updateItem.dueDate,
              ':done': true
          }

      },
      ((err, data)=>{
          if(err){
              console.log("updateTodo error="+err)
          }else{
              console.log("updateTodo success, data="+data)
          }
      })).promise()
  }

  

 
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
