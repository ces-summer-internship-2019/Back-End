const express = require('express');
const router = express.Router();
const songService = require('../services/song.service');

// routes
router.get('/search/:query', searchByQuery);
router.post('/add/:id', addToList);


module.exports = router;

function addToList(req, res, next) {
    songService.add()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function searchByQuery(req, res, next) {
    songService.search(req.params.query)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}
