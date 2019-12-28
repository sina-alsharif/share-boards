const router = require('express').Router();
const verify = require('./verify');
const mongoose = require('mongoose');
const Board = require('../models/Board');

router.post('/create', verify, (req, res) => {
    const newBoard = new Board({
        name: req.body.name,
        users: req.body.users,
        admins: req.header('auth-token')
    });
    newBoard.save((err) => {
        if(err) return res.status(400);
        return res.send(newBoard);
    });
});

router.get('/all', (req, res) => {
    Board.find((err, data) => {
        if (err) return res.json({success: false, err: err});
        return res.json({data});
    });
});

router.get('/:id', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.json({success: false, err: err});
        return res.json(data);
    });
});

router.post('/:id/addUser', (req, res) => {
   Board.findById(req.params.id, (err, data) => {
    if (err) return res.json({success: false, err: err});
    data.users.push(req.body.userID);
    res.json({data: data});
   });
});

router.post('/:id/addAdmin', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
     if (err) return res.json({success: false, err: err});
     if(data.users.contains )
     data.admins.push(req.body.userID);
     res.json({data: data});
    });
 });

router.delete('/:id/delete', (req, res) => {
    Board.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.json({success: false, err: err});
    return res.json({success: true});
    });
 });

module.exports = router;