const router = require('express').Router();
const verify = require('./verify');
const mongoose = require('mongoose');
const Board = require('../models/Board');
const User = require('../models/User');


router.get('/all', (req, res) => {
    Board.find((err, data) => {
        if (err) return res.json({success: false, err: err});
        return res.json({data});
    });
});

//Retrieve board
router.get('/:id', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.json({success: false, err: err});
        return res.json({data: data});
    });
});

//Create Board
router.post('/create', verify.userVerif, (req, res) => {
    const newBoard = new Board({
        name: req.body.name,
        users: req.body.users,
        admins: req.body.userID
    });

    newBoard.save((err) => {
        if(err) return res.status(400);
        return res.send(newBoard);
    });

    User.findById(req.body.userID, (err, data) => {
        if(err || !data) return res.send(501)
        data.boards.push(newBoard._id);
        data.save((err) => { return res.status(501)});
    });
});

//Delete Board
router.delete('/:id/delete', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.send(501).json({success: false, err: err});

        data.delete();
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
        return res.send("Board deleted.")
    });
});

// Admin and User CRUD

router.post('/:id/addUser', (req, res) => {
    if(req.body.userID)
   Board.findById(req.params.id, (err, data) => {
    if (err) return res.send(501).json({success: false, err: err});

    if(data.users.indexOf(req.body.userID) && data.admins.indexOf(req.body.userID) != -1 ){
        return res.json('This user already exists.')
    } 

    User.findById(req.body.userID, (err, data) => {
        if(err) return res.send(501)
        data.boards.push(req.params.id);
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
    data.users.push(req.body.userID);
    res.json({data});
    data.save((err) => {
        if (err) return res.send(501).json(err)
    });
   });
});

router.post('/:id/addAdmin', (req, res) => {
    var user = false;
    Board.findById(req.params.id, (err, data) => {
     if (err) return res.status(501).json({success: false, err: err});

     if(data.admins.indexOf(req.body.userID) != -1){
        return res.json('This admin already exists.')
    } 

    var i;
    for(i = 0; i < data.users.length; i++){
        if(data.users[i] === req.body.userID){
            data.users.splice(i, 1);
            user = true;
        }
    }

    if (!user) {
    User.findById(req.body.userID, (err, data) => {
        if(err) return res.send(501)
        data.boards.push(req.params.id);
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
}

     data.admins.push(req.body.userID);
     res.json({data: data});
     data.save((err) => {
        if (err) return res.send(501).json(err)
    });
    });
 });

router.delete('/:id/deleteUser', verify.userVerif ,verify.adminCheck, (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.send(501).json({success: false, err: err});

        var i;
        for(i = 0; i < data.users.length; i++){
            if(data.users[i] === req.body.userID){
                data.users.splice(i, 1);
            }
        }
        res.json({data});
        data.save((err) => {
        if (err) return res.send(501).json(err)
    });
    });
    
});

router.delete('/:id/deleteAdmin', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.send(501).json({success: false, err: err});
        var user = req.body.userID;
        var x;
        for(x = 0; x < data.admins.length; x++){
            if(data.admins[x] === user){
                data.admins.splice(x, 1);
            }
        }
        res.json({data});
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
});

//Update text
router.post('/:id/updateText', (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.send(501).json({success: false, err: err});

        data.text = req.body.text;
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
});

module.exports = router;