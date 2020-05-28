import 'source-map-support/register';
export const handler = async (event) => {
    const newTodo = JSON.parse(event.body);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    // TODO: Implement creating a new TODO itemzzzz
    const todoItem = await reateTodo(newTodo, jwtToken);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            todoItem
        })
    };
};
//# sourceMappingURL=createTodo.js.map