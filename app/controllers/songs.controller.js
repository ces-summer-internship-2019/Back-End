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
        .catch(err => next(err));
}

function searchByQuery(req, res, next) {
    songService.search(req.params.query)
        .then(msg => res.json(msg))
        .catch(err => next(err));
}
