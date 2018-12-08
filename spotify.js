var SpotifyWebApi = require('spotify-web-api-node');

var scopes = [
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-library-modify',
    'user-library-read',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'user-read-birthdate',
    'user-follow-read',
    'user-follow-modify',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-recently-played',
    'user-top-read'
];
var redirectUri = 'http://localhost:3000/callback';
var clientId = 'cf5274feb1dd42419a4caefc791debbb';
var clientSecret = '8388a5d672c44d27b9bd0ec3acbef58c';
var state = 'some-state-of-my-choice';

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri
  });

var getAuthURL = () => {
    spotifyApi.authURL = spotifyApi.createAuthorizeURL(scopes, state);
}

getAuthURL();

module.exports = spotifyApi;