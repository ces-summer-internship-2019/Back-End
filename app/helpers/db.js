const config = require('../configs/config.json');
const mongoose = require('mongoose');
mongoose.connect("mongodb://vuong:vuong123@ds263161.mlab.com:63161/music-app", { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Song: require('../models/song.model')
};