const config = require('../configs/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const { google } = require('googleapis');
const Song = db.Song;

module.exports = {
    add,
    search
};

async function add({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, name: "Anh Cu Ky" }, config.secret, { expiresIn: '30m' });
        return {
            ...userWithoutHash,
            token
        };
    }
}
// processing
async function search(query) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.search.list({
            auth: 'AIzaSyBfmlyyM7uBtom1wBGVkTUuY98PKhHa3iE',
            part: 'snippet',
            q: query
        });
        let videolist = searchResults.data.items;
        if (videolist.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            console.log(videolist);
            return `This video's ID is ${videolist[0].id.videoId}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            <div class="item">
                <iframe id="ytplayer" class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${videolist[0].id.videoId}?autoplay=1&disablekb=1&controls=0" 
                allow="autoplay" frameborder="0" allowfullscreen></iframe>
                <style>
                    iframe {pointer-events: none;}
                </style>
            </div>`;
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}
