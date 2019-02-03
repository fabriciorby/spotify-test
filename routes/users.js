var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

const SpotifyHelper = require('../spotifyHelper');
const spotifyHelper = new SpotifyHelper();

const DBHelper = require('../dbHelper')
const dbHelper = new DBHelper();

// create application/json parser
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//adiciona album/artista/track favorito
router.post('/adicionaFavorito/:tipo/:dataId', async (req, res, next) => {

  let tipo = req.params.tipo;
  let dataId = req.params.dataId;
  let userId = req.app.locals.userInfo.id;

  try {
    if (await dbHelper.userAddFavorite(userId, dataId, tipo))
      res.sendStatus(200);
    else
      res.sendStatus(403);
  } catch (err) {
    res.sendStatus(500);
    throw err;
  }

});

router.post('/removeFavorito/:tipo/:dataId', async (req, res, next) => {

  let tipo = req.params.tipo;
  let dataId = req.params.dataId;
  let userId = req.app.locals.userInfo.id;

  try {
    if (await dbHelper.userRemoveFavorite(userId, dataId, tipo))
      res.sendStatus(200);
    else
      res.sendStatus(403);
  } catch (err) {
    res.sendStatus(500);
    throw err;
  }

});

router.get('/consultaFavoritos/:tipo', async (req, res, next) => {

  let tipo = req.params.tipo;
  let userId = req.app.locals.userInfo.id;

  try {
    let idList = await dbHelper.getFavorites(userId, tipo);
    let dataList = await spotifyHelper.getInfosByIdList(tipo, idList);
    if (!dataList)
      res.sendStatus(403);
    res.render('conteudo', { list: dataList, listFavorites: idList });
  } catch (err) {
    res.sendStatus(500);
    throw err;
  }

});

module.exports = router;
