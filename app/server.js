require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt.jwt());

// api routes
app.get('/api', (req, res) => {
    res.send({ msg: 'Hello! Server is up and running' });
});

app.use('/api/users', require('./controllers/users.controller'));

app.use('/api/songs', require('./controllers/songs.controller'));

// catch all route
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
});


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
const server = app.listen(port, function () {
    console.log(`Server is running on port ${port}! Access by: http://localhost:${port}`);
});
