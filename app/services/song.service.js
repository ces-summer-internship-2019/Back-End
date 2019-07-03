const config = require('../configs/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const { google } = require('googleapis');
const Song = db.Song;

module.exports = {
    add,
    searchSongs,
    getSong
};

async function add({ id }) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.videos.list({
            auth: 'AIzaSyBfmlyyM7uBtom1wBGVkTUuY98PKhHa3iE',
            part: 'snippet',
            id: id
        });
        let videoItem = searchResults.data.items[0];
        if (videoItem.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            let song = new Song({
                videoId: videoItem.id,
                title: videoItem.snippet.title,
                channelTitle: videoItem.snippet.channelTitle,
                thumbnails: videoItem.snippet.thumbnails.medium.url,
            });
            await song.save();
            return 'Successfully Added';
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}
// processing
async function searchSongs(query) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.search.list({
            auth: 'AIzaSyBfmlyyM7uBtom1wBGVkTUuY98PKhHa3iE',
            part: 'snippet',
            type:'video',
            videoEmbeddable:true,
            maxResults: 5,
            videoCategoryId: '10',
            q: query
        });
        let videolist = searchResults.data.items;
        if (videolist.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            console.log(videolist);
<<<<<<< HEAD
            return `This video's ID is ${videolist[0].id.videoId}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            <div class="item">
                <iframe class="video w100" width="640" height="360" src="//www.youtube.com/embed/${videolist[0].id.videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
            </div>`;
=======
            return videolist;
            // return `This video's ID is ${videolist[0].id.videoId}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            // <div class="item">
            //     <iframe id="ytplayer" class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${videolist[0].id.videoId}?autoplay=1&disablekb=1&controls=0" 
            //     allow="autoplay" frameborder="0" allowfullscreen></iframe>
            //     <style>
            //         iframe {pointer-events: none;}
            //     </style>
            // </div>`;
>>>>>>> origin/haauj
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}
async function getSong(videoId) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.videos.list({
            auth: 'AIzaSyBfmlyyM7uBtom1wBGVkTUuY98PKhHa3iE',
            part: 'snippet',
            id:videoId
        });
        let videolist = searchResults.data.items;
        if (videolist.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            console.log(videolist);
            return `This video's ID is ${videolist[0].id}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            <div class="item">
                <iframe class="video w100" width="640" height="360" src="//www.youtube.com/embed/${videolist[0].id}" frameborder="0" allowfullscreen></iframe>
            </div>`;
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}