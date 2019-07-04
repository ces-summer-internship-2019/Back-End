const config = require('../configs/config.json');
const mongoose = require('mongoose');
const db = require('../helpers/db');
const { google } = require('googleapis');
const Song = db.Song;
const User = db.User;

module.exports = {
    addSongToList,
    searchSongs,
    voteASong,
    getSong
};

async function addSongToList({ id }, username) {
    const user = await User.findOne({ username });
    if (user.songAdd === 0) {
        return 'Already used Add';
    } else {
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
                user.songAdd = 0;
                await user.save();
                return 'Successfully Added';
            }
        }
        catch (error) {
            return error;
        }
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
            return videolist;
        }
    }
    catch (error) {
        return next(error);
    }
}

async function voteASong({ video_id, isUpvote }, username) {   // video_id : id in DB, not in Youtube
    mongoose.set('useFindAndModify', false);
    try {
        const votingUser = await User.findOne({ username });
        console.log(votingUser.username);
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