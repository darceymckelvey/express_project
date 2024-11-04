import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();

router.get('/api/users', query('filter').isString().notEmpty().withMessage('Must not be empty').isLength({min: 3, max: 10}).withMessage('Must be 3 to 10 chars'), (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const { query: {filter, value},
    } = request;

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    ); 

    return response.send(mockUsers);
});

export default router;