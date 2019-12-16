const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        type: Array
    }
});

module.exports = mongoose.model('Board', boardSchema);