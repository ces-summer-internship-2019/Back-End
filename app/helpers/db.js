const config = require('../configs/config.json');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/music-app", { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Song: require('../songs/song.model')
};