const spotifyApi = require('./spotifyConfig');

let SpotifyHelper = class SpotifyHelper {
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

    async getInfosByIdList(tipo, idList) {
        let data;
        let dataInfo = { data: [] };

        switch (tipo) {
            case 'album':
                data = await spotifyApi.getAlbums(idList);
                break;
            case 'track':
                data = await spotifyApi.getTracks(idList);
                break;
            case 'artist':
                data = await spotifyApi.getArtists(idList);
                break;
            default:
            // code block
        }

        let dataBodyTipo = data.body[tipo + 's'];

        dataInfo = preencheDataTipo(dataBodyTipo, dataInfo, tipo);
        dataInfo = preenchePagination(dataBodyTipo, dataInfo);

        return dataInfo;
    }

    async searchData(tipo, nome) {
        try {
            let dataInfo = { data: [] };
            let data = await spotifyApi.search(nome, [tipo], { limit: 20, offset: 0 });

            let dataBodyTipo = data.body[tipo + 's'];
            let page = dataBodyTipo.items;

            dataInfo = preencheDataTipo(page, dataInfo, tipo);
            dataInfo = preenchePagination(dataBodyTipo, dataInfo);

            return dataInfo;
        } catch (e) {
            console.log('Error while getting data info: ' + e);
        }
    }

};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function preencheDataTipo(page, dataInfo, tipo) {
//tipo -> artist, track, album
//artist -> foto e nome
//album -> foto, nome, artista, tipo de album, ano
//track -> foto, nome, artista, tipo de album, album, ano

    dataInfo.tipo = tipo;

    switch (tipo) {
        case 'album':
            page.forEach((data, index) => {
                dataInfo.data.push({ 'id': data.id, 'name': data.name });
                dataInfo.data[index].artist = data.artists.map((artist) => artist.name);
                dataInfo.data[index].release = data.release_date.substring(0, 4);
                dataInfo.data[index].album_type = capitalizeFirstLetter(data.album_type);
                dataInfo.data[index].images = data.images[2];
            });
            break;
        case 'track':
            page.forEach((data, index) => {
                dataInfo.data.push({ 'id': data.id, 'name': data.name });
                dataInfo.data[index].album = data.album.name;
                dataInfo.data[index].release = data.album.release_date.substring(0, 4);
                dataInfo.data[index].album_type = capitalizeFirstLetter(data.album.album_type);
                dataInfo.data[index].images = data.album.images[2];
            });
            break;
        case 'artist':
            page.forEach((data, index) => {
                dataInfo.data.push({ 'id': data.id, 'name': data.name });
                dataInfo.data[index].images = data.images[2];
            });
            break;
        default:
    }

    dataInfo.data.map((item, index) => console.log(1 + index + ': ' + JSON.stringify(item)));

    return dataInfo;
}

function preenchePagination(dataBodyTipo, dataInfo) {
    dataInfo.total = dataBodyTipo.total;
    dataInfo.offset = dataBodyTipo.offset;
    dataInfo.previous = dataBodyTipo.previous;
    dataInfo.next = dataBodyTipo.next;
    dataInfo.limit = dataBodyTipo.limit;
    return dataInfo;
}

module.exports = SpotifyHelper;