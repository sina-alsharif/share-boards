const jwt = require('jsonwebtoken');

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

module.exports = auth;