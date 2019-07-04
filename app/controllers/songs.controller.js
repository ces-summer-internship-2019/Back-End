const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');
const db = require('../helpers/db');
const jwt = require('../helpers/jwt');
const User = db.User;

// routes
router.get('/search/:query', searchByQuery);
router.post('/add/', addToList);
router.post('/vote/', votingSong);
router.get('/get/:id',getSongById);

module.exports = router;

async function addToList(req, res) {
    const user = await jwt.isValid(req);
    if (user) {
        songService.addSongToList(req.body, user.username)
            .then(song => res.json(song))
            .catch(err => res.send(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}

async function searchByQuery(req, res) {
    if (await jwt.isValid(req)) {
        songService.searchSongs(req.params.query)
                .then(msg => res.json(msg))
                .catch(err => res.send(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}
function getSongById(req, res, next) {
    songService.getSong(req.params.id)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}
async function votingSong(req, res) {   // upvote-downvote:true-false
    const user = await jwt.isValid(req);
    if (user) {
        songService.voteASong(req.body, user.username)
                .then(msg => res.json(msg))
                .catch(err => res.send(err));
    } else {
        res.send("Invalid TOKEN!!!");
    }
}