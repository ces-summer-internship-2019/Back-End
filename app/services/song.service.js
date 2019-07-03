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
        if ( searchResults.data.items.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            let videoItem = searchResults.data.items[0];
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
            return videolist;
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
        if (searchResults.data.items.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
        let videoItem = searchResults.data.items[0];
            console.log(videoItem);
            let song = new Song({
                videoId: videoItem.id,
                title: videoItem.snippet.title,
                channelTitle: videoItem.snippet.channelTitle,
                thumbnails: videoItem.snippet.thumbnails.medium.url,
            });
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}