import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
        {
            id: 1,
            username: 'darceymckelvey',
            displayName: "Darcey"
        },
        {
            id: 2,
            username: 'thunderclast',
            displayName: "Thunder"
        },
        {
            id: 3,
            username: 'nightraven',
            displayName: "Raven"
        },
        {
            id: 4,
            username: 'marilyn',
            displayName: "Mary"
        },
        {
            id: 5,
            username: 'dustbringer',
            displayName: "Dust"
        },
        {
            id: 6,
            username: 'Oysters',
            displayName: "Oyster"
        }
    ]

app.get('/', (request, response) => {
    response.status(200).send({msg: "Hello world!"});
});

app.get('/api/users', (request, response) => {
    console.log(request.query);
    const { query: {filter, value},
    } = request;

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    ); 

    return response.send(mockUsers);
});

app.get('/api/users/:id', (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    console.log(parsedId);
    if (isNaN(parsedId)) return response.status(400).send({msg: "Bad Request. Invalid ID."});

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.get('/api/products', (request, response) => {
    response.status(200).send([
        {
            id: 123, 
            name: 'Chicken Breast', 
            price: 12.99
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});
