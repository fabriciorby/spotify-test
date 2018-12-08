var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    throw err;
  }
  var db = client.db('animals');
  db.collection('aves').find().toArray((err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});

module.exports = MongoClient;