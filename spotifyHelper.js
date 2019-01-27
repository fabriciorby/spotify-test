const spotifyApi = require('./spotifyConfig');

var SpotifyHelper = class SpotifyHelper {
    constructor(spotifyApi) {
        this.spotifyApi = spotifyApi;
        this.state = 'some-state-of-my-choice';
        this.scopes = [
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
    }

    async getAuthURL() {
        return await spotifyApi.createAuthorizeURL(this.scopes, this.state);
    }

    /**
     * Set the credentials given on Spotify's My Applications page.
     * https://developer.spotify.com/my-applications
     */
    async getUserInfo() {
        try {
            let data = await spotifyApi.getMe();
            let user = {};
            user.name = data.body.display_name;
            user.email = data.body.email;
            user.id = data.body.id;
            return user;
        } catch (e) {
            console.log('Error while getting user info: ' + e)
        }
    }

    async getAccessToken() {
        // Retrieve an access token
        await spotifyApi.clientCredentialsGrant().then(
            (data) => {
                console.log(data);
                console.log('The access token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);

                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
            },
            (err) => {
                console.log(
                    'Something went wrong when retrieving an access token',
                    err.message
                );
            }
        );
    };

    async getRefreshToken(authorizationCode) {
        // When our access token will expire
        var tokenExpirationEpoch;
        // First retrieve an access token
        await spotifyApi.authorizationCodeGrant(authorizationCode).then(
            (data) => {
                // Set the access token and refresh token
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);

                // Save the amount of seconds until the access token expired
                tokenExpirationEpoch =
                    new Date().getTime() / 1000 + data.body['expires_in'];
                console.log(
                    'Retrieved token. It expires in ' +
                    Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                    ' seconds!'
                );
            },
            (err) => {
                console.log(
                    'Something went wrong when retrieving the access token!',
                    err.message
                );
            }
        );

        // Continually print out the time left until the token expires..
        var numberOfTimesUpdated = 0;

        setInterval(() => {

            // OK, we need to refresh the token. Stop printing and refresh.
            if (++numberOfTimesUpdated > 3500) {
                clearInterval(this);

                // Refresh token and print the new time to expiration.
                spotifyApi.refreshAccessToken().then(
                    function (data) {
                        tokenExpirationEpoch =
                            new Date().getTime() / 1000 + data.body['expires_in'];
                        console.log(
                            'Refreshed token. It now expires in ' +
                            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                            ' seconds!'
                        );
                    },
                    function (err) {
                        console.log('Could not refresh the token!', err.message);
                    }
                );
                numberOfTimesUpdated = 0;
            }
        }, 1000);
    }

    async getAlbum() {
        let listAlbum = { data: [] };
        await spotifyApi.getArtistAlbums('1dfeR4HaWDbWqFHLkxsg1d', { limit: 50, offset: 0 }).then(
            (data) => {
                let firstPage = data.body.items;
                firstPage.forEach(function (data, index) {
                    listAlbum['data'].push(
                        { 'id': data.id, 'name': data.name }
                    );
                    //debug
                    console.log(index + ': ' + data.name);
                });
            },
            (err) => {
                console.error(err);
            }
        );
        return listAlbum;
    }

    async getAlbumTracks() {
        await spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit: 5, offset: 1 }).then(
            (data) => {
                console.log(data.body);
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }

    //tipo -> artist, track, album
    //artist -> foto e nome
    //album -> foto, nome, artista, tipo de album, ano
    //track -> foto, nome, artista, tipo de album, album, ano
    async searchData(tipo, nome) {
        try {
            let firstPage = {};
            let total;
            let dataInfo = { data: [] };
            let data = await spotifyApi.search(nome, [tipo], { limit: 50, offset: 0 });

            switch (tipo) {
                case 'album':
                    firstPage = data.body.albums.items;
                    total = data.body.albums.total;
                    break;
                case 'track':
                    firstPage = data.body.tracks.items;
                    total = data.body.tracks.total;
                    break;
                case 'artist':
                    firstPage = data.body.artists.items;
                    total = data.body.artists.total;
                    break;
                default:
                // code block
            }

            firstPage.forEach(function (data, index) {
                dataInfo.data.push(
                    { 'id': data.id, 'name': data.name }
                );
                //checa para pesquisa de artista
                if (data.followers != undefined)
                    dataInfo.tipo = 'artist';
                if (data.images != undefined)
                    dataInfo.data[index].images = data.images[2];
                //checa para pesquisa de álbum
                if (data.artists != undefined) {
                    dataInfo.data[index].artist = [];
                    dataInfo.data[index].artist.push(data.artists[0].name);
                    dataInfo.tipo = 'album';
                }
                if (data.release_date != undefined)
                    dataInfo.data[index].release = data.release_date.substring(0,4);
                if (data.album_type != undefined)
                    dataInfo.data[index].album_type = capitalizeFirstLetter(data.album_type);
                //checa para pesquisa de track
                if (data.album != undefined) {
                    dataInfo.data[index].album = data.album.name;
                    dataInfo.data[index].release = data.album.release_date.substring(0,4);
                    dataInfo.data[index].album_type = capitalizeFirstLetter(data.album.album_type);
                    dataInfo.data[index].images = data.album.images[2];
                    dataInfo.tipo = 'track';
                }
                console.log(index + ': ' + JSON.stringify(dataInfo.data[index]));
            });
            console.log(dataInfo.tipo);
            dataInfo.total = total;
            return dataInfo;
        } catch (e) {
            console.log('Error while getting data info: ' + e);
        }
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = SpotifyHelper;