const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;