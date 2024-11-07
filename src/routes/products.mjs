import { Router } from "express";

const router = Router();

router.get('/api/products', (request, response) => {
    // without cookie-parser hello=world
    console.log(request.headers.cookie);
    // with cookie-parser { hello: 'world' }
    console.log(request.cookies);
    console.log(request.signedCookies);
    if (request.signedCookies.hello && request.signedCookies.hello === "world")
        return response.status(200).send([
            { id: 123, name: 'Chicken Breast', price: 12.99 }
        ]);
    
    return response.status(403).send({msg: 'sorry you need the proper cookie'});
});

export default router;