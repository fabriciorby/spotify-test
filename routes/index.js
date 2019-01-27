const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyConfig')
const SpotifyHelper = require('../spotifyHelper');
const spotifyHelper = new SpotifyHelper();
const constants = require('../config/constants');

const User = require('../models/User')

let title = constants.title;
let userInfo = {};

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
  
  let userSpotify = await spotifyHelper.getUserInfo();

  let query = { id: { $eq: userSpotify.id } };
  let update = { last_seen: new Date() };
  let options = { new: true, returnNewDocument: true }

  //check if user already exists, if so then update last_seen
  userInfo = await User.findOneAndUpdate(query, update, options,
    (err, data) => {
      if (err) throw err;
      return data;
    });

  //else, create new User on DB
  if (!userInfo) {
    userInfo = new User(userSpotify);
    await userInfo.save((err) => {
      if (err) throw err;
    })
  }

  console.log(userInfo);

  res.redirect('index');
});

//finalmente redirecionado para cá após o login
router.get('/index', async (req, res, next) => {
  res.render('index', { title: title, user: userInfo });
});

//finalmente redirecionado para cá após o login
router.get('/conteudo', async (req, res, next) => {
  let listAlbum = await spotifyHelper.getAlbum();
  res.render('conteudo', { title: title, list: listAlbum, user: userInfo });
});

//search for artist, album, track
router.get('/search', async (req, res, next) => {
  let listData = await spotifyHelper.searchData(req.query.tipo, req.query.nome);
  res.render('conteudo', { title: title, list: listData, user: userInfo });
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