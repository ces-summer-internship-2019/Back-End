const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');

// routes
router.get('/search/:query', searchByQuery);
<<<<<<< HEAD
router.post('/add/:id', addToList);
router.get('/get/:id',getSongById);
=======
router.get('/add/', addToList);
>>>>>>> origin/haauj


module.exports = router;

function addToList(req, res, next) {
    songService.add(req.body)
        .then(song => res.json(song))
        .catch(err => res.send(err));
}

function searchByQuery(req, res, next) {
<<<<<<< HEAD
    songService.searchSongs(req.params.query)
        .then(msg => res.send(msg))
        .catch(err => next(err));
=======
    songService.search(req.params.query)
        .then(msg => res.json(msg))
        .catch(err => res.send(err));
>>>>>>> origin/haauj
}
function getSongById(req, res, next) {
    songService.getSong(req.params.id)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}