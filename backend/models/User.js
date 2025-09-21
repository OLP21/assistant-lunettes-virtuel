// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
username: {
    type: String,
    required: true, 
    unique: true,
    trim: true
},
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
passwordHash:{
    type: String, 
    required: true
},
favorites: [{
    glasses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Glasses'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}]
}, { timestamps: true});

module.exports = mongoose.model('User', UserSchema);