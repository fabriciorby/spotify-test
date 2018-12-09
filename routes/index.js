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
  res.redirect('conteudo');
});

//finalmente redirecionado para cá após o login
router.get('/conteudo', async (req,res,next) => {
  let listAlbum = await spotifyHelper.getAlbum();
  listAlbum = Array.from(listAlbum.entries());
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