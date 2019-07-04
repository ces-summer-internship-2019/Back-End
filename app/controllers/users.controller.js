﻿const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/logout', logout);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
// processing
function logout(req, res, next) {
    userService.logout(req.body)
        .then(msg => res.send(msg))
        .catch(err => next(err));
}
// processing
function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.status(201).json({ message: "New User succesfully Created!" }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.status(200).json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(req.user) : res.sendStatus(404).json({ message: "Not logged in!" }))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.status(200).json({ message: "User successfully updated !!!" }))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.status(200).json({ message: "User successfully deleted !!!" }))
        .catch(err => next(err));
}