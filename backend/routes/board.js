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
        users: [],
        admins: req.body.userID
    });

    newBoard.save((err, data) => {
        if(err) return res.status(400);
        return res.json({data: data});
    });

    User.findById(req.body.userID, (err, data) => {
        if(err || !data) return res.send(501)
        data.boards.push(newBoard._id);
        data.save((err) => { return res.status(501)});
    });
});

//Delete Board
router.delete('/:id/delete', verify.adminCheck, (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err || !data) return res.sendStatus(501).json({success: false, err: err});

        for(var i = 0; i < data.users.length; i++){
            User.findById(data.users[i], (err, data) => {
                if(err || !data) return res.sendStatus(501)
        
                const index = data.boards.indexOf(req.params.id);
                if (index > -1){
                    data.boards.splice(index, 1);
                }
                data.save((err) => {
                    if (err) return res.sendStatus(501).json(err)
                });
            });
        }

        for(var i = 0; i < data.admins.length; i++){
            User.findById(data.admins[i], (err, data) => {
                if(err || !data) return res.sendStatus(501)
        
                const index = data.boards.indexOf(req.params.id);
                if (index > -1){
                    data.boards.splice(index, 1);
                }
                data.save((err) => {
                    if (err) return res.sendStatus(501).json(err)
                });
            });
        }

        data.delete();
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
        return res.send("Board deleted.")
    });
});

// Admin and User CRUD

router.post('/:id/addUser',  (req, res) => {
    if(req.body.user)
    var userID = "";
    User.findOne({email: req.body.user}, (err, data) => {
        if (err || !data) return res.status(501);
        
        userID = data._id;
        console.log(userID);
    });
   Board.findById(req.params.id, async (err, data) => {
    if (err) return res.status(501);

    if(!userID) return res.status(501).send("Failed.");
   
    if(data.users.indexOf(userID) > -1 || data.admins.indexOf(userID) > -1 ){
        return res.status(400).json({err: 'This user already exists.'});
    } 
    
    User.findById(userID, (err, data) => {
        if (err || !data) return res.status(501);

        data.boards.push(req.params.id);
        data.save((err) => {
            if (err) return res.status(501)
        });
    });

    data.users.push(userID);
    res.json({data});
    data.save((err) => {
        if (err) return res.send(501).json(err)
    });
   });
});

router.post('/:id/addAdmin', verify.adminCheck, async (req, res) => {
    var user = false;
    var userID;
    
   await User.findOne({email: req.body.user}, (err, data) => {
        if (err || !data) return res.status(501);
        
        userID = data._id;
        console.log(userID);
    
    });
    Board.findById(req.params.id, (err, data) => {
     if (err) return res.status(501).json({success: false, err: err});

     if(data.admins.indexOf(userID) != -1){
        return res.json('This admin already exists.')
    } 

    var index = data.users.indexOf(userID);
    if(index > -1){
        data.users.splice(index, 1);
        user = true;
    }

    if (!user) {
    User.findById(userID, (err, data) => {
        if(err) return res.send(501)
        data.boards.push(req.params.id);
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
}

     data.admins.push(userID);
     res.json({data: data});
     data.save((err) => {
        if (err) return res.send(501).json(err)
    });
    });
 });

router.delete('/:id/deleteUser', verify.adminCheck, (req, res) => {
    var userID;
    Board.findById(req.params.id, async (err, data) => {
        if (err) return res.send(502).json({
            success: false,
            err: err
        });

        await User.findOne({email: req.body.user}, (err, data) => {
            if (err || !data) return res.send(503).json({
                success: false,
                err: err
            });

            userID = data._id;
            console.log(userID);


            const index = data.boards.indexOf(req.params.id);
            if (index > -1) {
                data.boards.splice(index, 1);
            }
            data.save((err) => {
                if (err) return res.send(501).json(err)
            });
        });

        const index = data.users.indexOf(userID);
        if (index > -1){
            data.users.splice(index, 1);
        }
        data.save((err) => {
            if (err) return res.status(504).json(err)
        });
        res.json({
            data
        });
    });
});

router.delete('/:id/deleteAdmin', verify.adminCheck, (req, res) => {
    var userID;
    Board.findById(req.params.id, async (err, data) => {
        if (err) return res.send(502).json({
            success: false,
            err: err
        });

        await User.findOne({email: req.body.user}, (err, data) => {
            if (err || !data) return res.send(503).json({
                success: false,
                err: err
            });

            userID = data._id;
            console.log(userID);


            const index = data.boards.indexOf(req.params.id);
            if (index > -1) {
                data.boards.splice(index, 1);
            }
            data.save((err) => {
                if (err) return res.send(501).json(err)
            });
        });

        const index = data.admins.indexOf(userID);
        if (index > -1){
            data.admins.splice(index, 1);
        }
        data.save((err) => {
            if (err) return res.status(504).json(err)
        });
        res.json({
            data
        });
    });
});

//Update text
router.post('/:id/updateText', verify.userVerif, verify.adminCheck, (req, res) => {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.send(501).json({success: false, err: err});

        data.text = req.body.text;
        data.save((err) => {
            if (err) return res.send(501).json(err)
        });
    });
});

module.exports = router;