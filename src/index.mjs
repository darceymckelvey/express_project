import express from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';

import { createUserValidationSchema } from './utils/validationSchemas.mjs';

const app = express();

// middleware
app.use(express.json());

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
    const { 
        params:{ id }
    } = request;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId); 
    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
}

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

app.get(
    '/',
    (request, response, next) => { 
        console.log('Base URL');
        next();
     },
    (request, response) => {
    response.status(200).send({msg: "Hello world!"});
});

app.get('/api/users', query('filter').isString().notEmpty().withMessage('Must not be empty').isLength({min: 3, max: 10}).withMessage('Must be 3 to 10 chars'), (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const { query: {filter, value},
    } = request;

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    ); 

    return response.send(mockUsers);
});

app.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
        const result = validationResult(request);
        console.log(result);
        
        if (!result.isEmpty())
            return response.status(400).send({ errors: result.array() });

        const data = matchedData(request);

        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        return response.status(201).send(newUser);
}); 

app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
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

// PUT updates all field so if not provided iut will be updated without it
app.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(204);
});

// PATCH you can updat username and all unprovided keys stay the same
app.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(204);
});

app.delete('/api/users/:id',resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;

    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(204);
});