var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotify');
var SpotifyHelper = require('../spotifyHelper');
var spotifyHelper = new SpotifyHelper();

/* GET home page. */
router.get('/', (req, res, next) => {
  var authURL = spotifyApi.authURL;
  res.render('logar', { title: 'Teste' , spotifyAuthURL: authURL});
});

//chamado após a autenticação Spotify apenas para pegar o code
router.get('/callback', async (req, res, next) => {
  var code = req.query.code;
  if (!spotifyApi.getRefreshToken())
    await spotifyHelper.getRefreshToken(code);
  res.redirect('conteudo');
});

//finalmente redirecionado para cá após o login
router.get('/conteudo', async (req,res,next) => {
  let listAlbum = await spotifyHelper.getAlbum();
  res.render('conteudo', { title: 'Teste', list: listAlbum});
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