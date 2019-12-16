const router = require('express').Router();
const verify = require('./verify');
const mongoose = require('mongoose');
const Board = require('../models/Board');

router.post('/create', verify, (req, res) => {
    const newBoard = new Board({
        name: req.body.name,
        users: req.header('auth-token')
    });
    newBoard.save((err) => {
        if(err) return res.status(400);
        return res.send(newBoard);
    });
});

router.post('/:id/addUser', (req, res) => {
   Board.findById(req.params.id, (err, data) => {
    data.users.push(req.body.userID);
    res.json({data: data});
   });
});

module.exports = router;