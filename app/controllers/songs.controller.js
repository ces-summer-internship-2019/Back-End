﻿const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');
const db = require('../helpers/db');
const jwt = require('../helpers/jwt');
const User = db.User;

// routes
router.get('/search/:query', searchByQuery);
router.post('/add/', addToList);
router.post('/vote/', votingSong);
router.get('/get/:id', getSongById);

module.exports = router;

async function addToList(req, res) {
    const user = await jwt.isValid(req);
    if (user) {
        songService.addSongToList(req.body, user.username)
            .then(song => res.status(200).send(song))
            .catch(err => res.status(400).send(err));
    } else {
        res.status(403).json({ message: "Invalid TOKEN!!!" });
    }
}

async function searchByQuery(req, res) {
    songService.searchSongs(req.params.query)
        .then(msg => res.status(200).json(msg))
        .catch(err => res.status(400).send(err));
}
async function getSongById(req, res, next) {
    if (await jwt.isValid(req)) {
        songService.getSong(req.params.id)
            .then(msg => res.status(200).send(msg))
            .catch(err => next(err));
    } else {
        res.status(403).json({ message: "Invalid TOKEN!!!" });
    }
}
async function votingSong(req, res) {   // upvote-downvote:true-false
    const user = await jwt.isValid(req);
    if (user) {
        songService.voteASong(req.body, user.username)
            .then(msg => res.status(200).json(msg))
            .catch(err => res.status(400).send(err));
    } else {
        res.status(403).json({ message: "Invalid TOKEN!!!" });
    }
}