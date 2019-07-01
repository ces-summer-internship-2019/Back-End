const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');

// routes
router.get('/search/:query', searchByQuery);
router.post('/add/:id', addToList);
router.get('/get/:id',getSongById);


module.exports = router;

function addToList(req, res, next) {
    songService.add()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function searchByQuery(req, res, next) {
    songService.searchSongs(req.params.query)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}
function getSongById(req, res, next) {
    songService.getSong(req.params.id)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}