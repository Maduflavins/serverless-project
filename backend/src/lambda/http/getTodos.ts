import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const allTodos = await getAllTodos() 
  return{
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      allTodos
    })
  }

}
