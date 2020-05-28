import 'source-map-support/register'
import { TodoAccess } from '../../dataLayer/TodoAccess'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todoAccess = new TodoAccess()
  const deleteItem = await todoAccess.deleteTodo(todoId, event)

  // TODO: Remove a TODO item by id
  return{
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      "message": "succesfully deleted an item",
      deleteItem
      
    })
  }
}
