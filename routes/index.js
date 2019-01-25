const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyConfig')
const SpotifyHelper = require('../spotifyHelper');
const spotifyHelper = new SpotifyHelper();

/* GET home page. */
router.get('/', async (req, res, next) => {
  spotifyApi.setRedirectURI(req.protocol + '://' + req.get('host') + '/callback');
  let authURL = await spotifyHelper.getAuthURL();
  res.render('logar', { title: 'Teste' , spotifyAuthURL: authURL});
});

//chamado após a autenticação Spotify apenas para pegar o code
router.get('/callback', async (req, res, next) => {
  let code = req.query.code;
  if (!spotifyApi.getRefreshToken())
    await spotifyHelper.getRefreshToken(code);
  res.redirect('index');
});

//finalmente redirecionado para cá após o login
router.get('/index', async (req,res,next) => {
  let userInfo = await spotifyHelper.getUserInfo();
  console.log(userInfo);
  res.render('index', { title: 'Teste', user: userInfo});
});

//finalmente redirecionado para cá após o login
router.get('/conteudo', async (req,res,next) => {
  let listAlbum = await spotifyHelper.getAlbum();
  listAlbum = Array.from(listAlbum.entries());
  res.render('conteudo', { title: 'Teste', list: listAlbum});
});

//search for artist, album, track
router.get('/search/:tipo/:nome', async (req,res,next) => {
  let listData = await spotifyHelper.searchData(req.params.tipo, req.params.nome);
  res.send(listData);
});

router.get('/error', function(req, res, next) {
  res.render('error', {
    title: 'Teste',
    message: 'mensagem',
    error: {
      status: 'rs',
      stack: 'lalala'
    }});
});

module.exports = router;