const express = require('express');
const router = express.Router();

const spotifyApi = require('../spotifyConfig')
const SpotifyHelper = require('../spotifyHelper');
const spotifyHelper = new SpotifyHelper();

const DBHelper = require('../dbHelper')
const dbHelper = new DBHelper();

const constants = require('../config/constants');

let title = constants.title;
let userInfo;

/* GET home page. */
router.get('/', async (req, res, next) => {
  spotifyApi.setRedirectURI(req.protocol + '://' + req.get('host') + '/callback');
  let authURL = await spotifyHelper.getAuthURL();
  res.render('logar', { title: title, spotifyAuthURL: authURL });
});

//chamado após a autenticação Spotify: pega code e salva user no db
router.get('/callback', async (req, res, next) => {
  let code = req.query.code;

  if (!spotifyApi.getRefreshToken())
    await spotifyHelper.getRefreshToken(code);
  
  let spotifyUser = await spotifyHelper.getUserInfo();

  req.app.locals.userInfo = await dbHelper.setOrUpdateUser(spotifyUser);

  userInfo = req.app.locals.userInfo;
  
  res.redirect('index');
});

//finalmente redirecionado para cá após o login
router.get('/index', async (req, res, next) => {
  res.render('index', { title: title, user: userInfo });
});

//display da tabela
router.get('/conteudo', async (req, res, next) => {
  let listAlbum = await spotifyHelper.getAlbum();
  res.render('conteudo', { title: title, list: listAlbum, user: userInfo });
});

//search for artist, album, track
router.get('/search', async (req, res, next) => {
  let listData = await spotifyHelper.searchData(req.query.tipo, req.query.nome);
  let listFavorites = await dbHelper.getFavorites(userInfo.id, req.query.tipo);
  res.render('conteudo', { title: title, list: listData, listFavorites: listFavorites, user: userInfo });
});

router.get('/error', function (req, res, next) {
  res.render('error', {
    title: 'Teste',
    message: 'mensagem',
    error: {
      status: 'rs',
      stack: 'lalala'
    }
  });
});

module.exports = router;