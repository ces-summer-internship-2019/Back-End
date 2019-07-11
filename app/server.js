require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cron = require('node-schedule');
const userController = require('./users/users.controller');
const songController = require('./songs/songs.controller');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt.jwt());

// api routes
app.get('/api', (req, res) => {
    res.send({ msg: 'Hello! Server is up and running' });
});

app.use('/api/users', require('./users/users.controller'));

app.use('/api/songs', require('./songs/songs.controller'));

// catch all route
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'API Not Found' });
});


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
    // reset by schedule at 5:30 pm
    /*
        // run the job at 18:55:30 on Dec. 14 2018
        const rule = new cron.RecurrenceRule();
        rule.hour = 14;
        rule.minute = 38;
        cron.scheduleJob(rule, function () {
            userController.reset();
            songController.reset();
        });
    */
    
});

