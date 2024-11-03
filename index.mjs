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
        }
    ]

app.get('/', (request, response) => {
    response.status(200).send({msg: "Hello world!"});
});

app.get('/api/users', (request, response) => {
    response.send(mockUsers);
});

app.get('/api/users/:id', (request, response) => {
    console.log(request.params);
    const parseId = parseInt(request.params.id);
    console.log(parseId);
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
