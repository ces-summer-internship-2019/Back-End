﻿const config = require('../configs/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const { google } = require('googleapis');
const Song = db.Song;

module.exports = {
    add,
    search
};

async function add({ id }) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.videos.list({
            auth: 'AIzaSyBfmlyyM7uBtom1wBGVkTUuY98PKhHa3iE',
            part: 'snippet',
            id: id
        });
        let videoItem = searchResults.data.items;
        if (videoItem.length == 0) {
            console.log('No Video Found');
            return 'No Video Found';
        } else {
            console.log(videoItem);
            return videoItem;
            // return `This video's ID is ${id}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            // <div class="item">
            //     <iframe id="ytplayer" class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${id}?autoplay=1&disablekb=1&controls=0" 
            //     allow="autoplay" frameborder="0" allowfullscreen></iframe>
            //     <style>
            //         iframe {pointer-events: none;}
            //     </style>
            // </div>`;
        }
    }
    catch (error) {
        return next("Error in search API " + error);
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
            return videolist;
            // return `This video's ID is ${videolist[0].id.videoId}. Its title is ${videolist[0].snippet.title} and it has published by ${videolist[0].snippet.channelTitle}
            // <div class="item">
            //     <iframe id="ytplayer" class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${videolist[0].id.videoId}?autoplay=1&disablekb=1&controls=0" 
            //     allow="autoplay" frameborder="0" allowfullscreen></iframe>
            //     <style>
            //         iframe {pointer-events: none;}
            //     </style>
            // </div>`;
        }
    }
    catch (error) {
        return next("Error in search API " + error);
    }
}
