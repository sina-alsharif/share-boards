const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        type: Array
    },
    admins: {
        type: Array
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('Board', boardSchema);