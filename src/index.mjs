import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'far over the misty mountains',
    // will save empty objects on your db if true
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}));
// end-ports
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get('/', (request, response) => {
    console.log(request.session.id);
    // makes it so that the session key isnt regenerated everytime you reload
    request.session.visited = true;

    response.cookie('hello', 'world', {maxAge: 30000, signed: true});
    // hello=world; Path=/; Expires=Thu, 07 Nov 2024 07:46:19 GMT; withoput cookie-parser installed it gets sent like this, 
    response.status(200).send({msg: "Hello"});
});

// mapping a users session
// also should be in its own routes file
app.post('/api/auth', (request, response) => {
    // ussually there would be edge cases to do here
    const { body } = request;
});