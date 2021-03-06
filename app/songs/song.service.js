﻿const config = require('../configs/config.json');
const mongoose = require('mongoose');
const db = require('../helpers/db');
const { google } = require('googleapis');
const Song = db.Song;
const User = db.User;

module.exports = {
    addSong,
    searchSong,
    voteSong,
    getPlaylist,
    removeSong,
    reset
};

async function addSong({ id }, username) {
    const user = await User.findOne({ username });
    if (user.songAdd === 0) {
        return 'Already used Add';
    } else {
        let service = google.youtube('v3');
        try {
            const searchResults = await service.videos.list({
                auth: config.API_KEY,
                part: 'snippet, contentDetails',
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
                    duration: convert_time(videoItem.contentDetails.duration)
                });
                await song.save();
                user.songAdd = 0;
                await user.save();
                return {
                    status: "201",
                    data: song
                };
            }
        }
        catch (error) {
            return error;
        }
    }

}
// processing
async function searchSong(query) {
    let service = google.youtube('v3');
    try {
        const searchResults = await service.search.list({
            auth: config.API_KEY,
            part: 'snippet',
            type: 'video',
            videoEmbeddable: true,
            maxResults: 10,
            videoCategoryId: '10',
            q: query
        });
        let videolist = searchResults.data.items;
        if (videolist.length == 0) {
            return {
                status: 204,
                message: 'No video found'
            };
        } else {
            const filteredListVideo = await filterResult(videolist);
            return {
                status: 200,
                message: filteredListVideo
            };
        }
    }
    catch (error) {
        return next(error);
    }
}

async function voteSong({ video_id, isUpvote }, username) {   // video_id : id in DB, not in Youtube
    mongoose.set('useFindAndModify', false);
    try {
        const votingUser = await User.findOne({ username });
        if (votingUser.vote > 0) {
            const userDecreaseVote = await User.findOneAndUpdate({ username: username }, { $inc: { vote: -1 } });
            if (userDecreaseVote) {
                await Song.findOneAndUpdate({ _id: mongoose.Types.ObjectId(video_id) }, { $inc: isUpvote === true ? { upvote: 1 } : { downvote: 1 } });
                return { status: '201', Message: `Successfully voted!!!` };
            }
        }
        else {
            return { status: '202', Message: 'Out of vote!!!' }
        }
    }
    catch (error) {
        return ({
            status: '202', Message: error
        });
    }
}

async function filterResult(videolist) {
    let filteredList = [];
    videolist.forEach(item =>
        filteredList.push({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnails: item.snippet.thumbnails.medium.url,
        })
    )
    return filteredList;
}

async function getPlaylist() {
    try {
        const playList = await Song.find({});
        playList.sort(function (a, b) {
            return (b.upvote - b.downvote) - (a.upvote - a.downvote);
        });
        if (playList.length > 0)
            return {
                status: 200,
                message: playList
            };
        else {
            return {
                status: 204,
                message: "There is no song in the play list now!"
            };
        }
    }
    catch (error) {
        return {
            status: 204,
            message: "Error" + error
        };
    }
}
async function removeSong({ video_id }) {
    try {
        const removeResult = await Song.deleteOne({ _id: mongoose.Types.ObjectId(video_id) });
        if (removeResult)
            return {
                status: 200,
                message: "Remove song succesfully!"
            };
        else
            return {
                status: 202,
                message: "Failed to remove song!"
            };
    }
    catch (error) {
        return {
            status: 202,
            message: error
        };
    }
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}
async function reset() {
    await Song.deleteMany({});
    return {
        message: "Successfully Reset Song!!!"
    };
}