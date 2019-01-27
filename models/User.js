var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  created_on: { type: Date, default: Date.now },
  album_wallet: {id: [String]},
  friends: {id: [String]},
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);