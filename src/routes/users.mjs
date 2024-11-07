import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

router.get('/api/users', query('filter').isString().notEmpty().withMessage('Must not be empty').isLength({min: 3, max: 10}).withMessage('Must be 3 to 10 chars'), (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
        }
        console.log(sessionData);
    })

    const result = validationResult(request);
    const { query: {filter, value},
    } = request;

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    ); 

    return response.send(mockUsers);
});

router.get(
    '/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

router.post(
    '/api/users', 
    checkSchema(createUserValidationSchema), 
    (request, response) => {
    const result = validationResult(request);
    console.log(result);
    
    if (!result.isEmpty())
        return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});

// PUT updates all field so if not provided iut will be updated without it
router.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(204);
});

// PATCH you can updat username and all unprovided keys stay the same
router.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(204);
});

router.delete('/api/users/:id',resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;

    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(204);
});

export default router;