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
const songService = require('./songs/song.service');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
var currentSong = undefined;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt.jwt());


// api routes
app.get('/api', (req, res) => {
    res.send({ msg: 'Hello! Server is up and running' });
});

// socket io test routes
app.get('/socket-io', (req, res) => {
    res.sendFile('socket-test.html', { root: __dirname });
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
server.listen(port, function () {
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
io.sockets.on('connection', async function (socket) {
    // connections.push(socket);
    // console.log(socket.id);
    const playlist = (await songService.getPlaylist()).message;
    let scheduleTime = [];
    scheduleTime[0] = new cron.RecurrenceRule();
    scheduleTime[0].hour = 15;
    scheduleTime[0].minute = 20;
    scheduleTime[0].second = 0;

    for (let i = 1; i < playlist.length; i++) {
        const duration = playlist[i - 1].duration;
        const hour = (duration / 3600 | 0);
        const minute = ((duration - 3600 * hour) / 60 | 0);
        const sec = duration - 3600 * hour - 60 * minute;
        scheduleTime[i] = new cron.RecurrenceRule();
        scheduleTime[i].hour = scheduleTime[i - 1].hour + hour;
        scheduleTime[i].minute = scheduleTime[i - 1].minute + minute;
        scheduleTime[i].second = scheduleTime[i - 1].second + sec;
        if (scheduleTime[i].second >= 60) {
            scheduleTime[i].second = scheduleTime[i].second % 60;
            scheduleTime[i].minute += 1;
        }
        if (scheduleTime[i].minute >= 60) {
            scheduleTime[i].minute = scheduleTime[i].minute % 60;
            scheduleTime[i].hour += 1;
        }
        playlist[i - 1].startAt = {
            hour: scheduleTime[i - 1].hour,
            minute: scheduleTime[i - 1].minute,
            second: scheduleTime[i - 1].second
        }
    }
    if (currentSong === undefined) {
        currentSong = playlist[0];
    }
    for (let i = 0; i < playlist.length; i++) {
        cron.scheduleJob(scheduleTime[i], function () {
            currentSong = playlist[i];
            io.sockets.emit('play', playlist[i]);
        });
    }
    let now = new Date();
    if (now.getHours() >= scheduleTime[0].hour && now.getMinutes() >= scheduleTime[0].minute) {
        socket.emit('play', currentSong);
    }
    // if(thoi gian > 15:30) {
    //     // tinh toan
    //     io.sockets.emit(su kien gi do, params);
    // }
});

