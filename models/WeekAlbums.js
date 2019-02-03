var mongoose = require('mongoose');

var WeekAlbumsWallettSchema = new mongoose.Schema({
  name: String,
  creator: String,
  participants: {id: [String]},
  created_on: { type: Date, default: Date.now },
  albums: {id: [String]},
  active: Boolean,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeekAlbums', WeekAlbumsWallettSchema);