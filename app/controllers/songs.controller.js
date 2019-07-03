const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');

// routes
router.get('/search/:query', searchByQuery);
router.get('/add/', addToList);


module.exports = router;

function addToList(req, res, next) {
    songService.add(req.body)
        .then(song => res.json(song))
        .catch(err => res.send(err));
}

function searchByQuery(req, res, next) {
    songService.search(req.params.query)
        .then(msg => res.json(msg))
        .catch(err => res.send(err));
}
function getSongById(req, res, next) {
    songService.getSong(req.params.id)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}