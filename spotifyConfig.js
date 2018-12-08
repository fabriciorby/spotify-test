var SpotifyWebApi = require('spotify-web-api-node');

var clientId = 'cf5274feb1dd42419a4caefc791debbb';
var clientSecret = '8388a5d672c44d27b9bd0ec3acbef58c';

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

module.exports = spotifyApi;