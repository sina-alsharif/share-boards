const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const validSchema = Joi.object({
    // name: Joi.string().required().min(2),
    password: Joi.string().min(6).required(),
    email: Joi.string().min(7).email()
});

router.post('/register', async (req, res) => {

    const { error } = validSchema.validate(req.body);
    if (error != null) {
        return res.status(402).json({err: error.details[0].message});
    }

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(403).json({err: "Email already exists."});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    try{
        await user.save();
        res.send(user._id);
    }catch(err){
        res.status(405).json({err: err});
    }
});

router.post('/login', async (req, res) => {

    const { error } = validSchema.validate(req.body);
    if (error != null) {
        return res.status(401).json({message: error.details[0].message});
    }

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).json({message: "The email provided is not valid."});

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(401).json({message: "The password is not valid."});

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SCRT);
    res.header('auth-token', token).json({userID: user._id, status: 200, token: token, boards: user.boards});
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) return res.json({success: false, err: err});
        return res.json({data: data});
    });
});

module.exports = router;