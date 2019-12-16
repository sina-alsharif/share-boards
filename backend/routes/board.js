const router = require('express').Router();
const verify = require('./verify');

router.post('/create', verify, (req, res) => {
    res.send('You should not be here');
});

module.exports = router;