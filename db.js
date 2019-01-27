const mongoose = require('mongoose');

let uristring = process.env.MONGODB_URI || 'mongodb://localhost:27017/animals'

mongoose.connect(uristring, { useNewUrlParser: true }, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});

// let db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("we're connected!");
// });

module.exports = mongoose;