const jwt = require('jsonwebtoken');
const Board = require('../models/Board');

function auth(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Forbidden');

    try{
        const verif = jwt.verify(token, process.env.TOKEN_SCRT);
        req.user = verif; 
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}

function adminVerif(req, res, next) {
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.status(501)

        const usertkn = req.header('auth-token');
        if(!usertkn) return res.status(401).send('Forbidden');

        const requestID = jwt.verify(usertkn, process.env.TOKEN_SCRT)._id;

        if(data.admins.indexOf(requestID) === -1 ){
            return res.status(401).send("You are not an admin.");
        } 

        next();
    });
}

function userCheck(req, res, next){
    Board.findById(req.params.id, (err, data) => {
        if (err) return res.status(501)

        const usertkn = req.header('auth-token');
        if(!usertkn) return res.status(401).send('Forbidden');

        const requestID = jwt.verify(usertkn, process.env.TOKEN_SCRT)._id;

        if(data.users.indexOf(requestID) === -1 ){
            return res.status(401).send("You are not an admin.");
        } 

        next();
    });
}


module.exports = {userVerif: auth, adminCheck: adminVerif, userCheck: userCheck};