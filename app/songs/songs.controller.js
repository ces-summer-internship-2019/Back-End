const express = require('express');
const router = express.Router();
const songService = require('./song.service');
const db = require('../helpers/db');
const jwt = require('../helpers/jwt');
const User = db.User;

// routes
router.get('/search/:query', searchSong);
router.get('/playlist', getPlaylist);
router.post('/add', addSong);
router.post('/vote', voteSong);
router.post('/remove', removeSong);

module.exports = router;
module.exports.reset = reset;

async function addSong(req, res) {
    const user = await jwt.isValid(req);
    if (user) {
        songService.addSong(req.body, user.username)
            .then(song => res.json(song))
            .catch(err => res.send(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}

async function searchSong(req, res) {
    if (await jwt.isValid(req)) {
        songService.searchSong(req.params.query)
            .then(msg => res.json(msg))
            .catch(err => res.json(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}

async function voteSong(req, res) {   // upvote-downvote:true-false
    const user = await jwt.isValid(req);
    if (user) {
        songService.voteSong(req.body, user.username)
            .then(msg => res.status(msg.status).json(msg.message))
            .catch(err => res.status(400).send(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}

function getPlaylist(req, res) {   // upvote-downvote:true-false
    songService.getPlaylist()
        .then(msg => res.status(msg.status).json(msg.message))
        .catch(err => res.status(400).send(err));
}

function removeSong(req, res) {   // upvote-downvote:true-false
    songService.removeSong(req.body)
        .then(msg => res.status(msg.status).json(msg.message))
        .catch(err => res.status(400).send(err));
}
function reset() {
    songService.reset()
        .then(msg => console.log(msg.message))
        .catch(err => console.log(err));
}
