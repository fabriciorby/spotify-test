var mongoose = require('../db');

var UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    created_on: { type: Date, default: Date.now },
    album_wallet: { id: [String] },
    favorites: {album: [String], artist: [String], track: [String]},
    friends: { id: [String] },
    updated_date: { type: Date, default: Date.now },
    last_seen:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);