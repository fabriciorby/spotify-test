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

router.get('/consultaFavoritos/:tipo/:numPage', async (req, res, next) => {

  const tipo = req.params.tipo;
  const userId = req.app.locals.userInfo.id;
  const maxItems = 20; //20 é o valor máximo
  const numPage = req.params.numPage;
  let idList;
  let dataList = { data: [] };
  let totalPages = 0;

  try {
    idList = await dbHelper.getFavorites(userId, tipo);

    console.log(idList);

    if (idList.length) {
      totalPages = Math.ceil(idList.length/maxItems);
      if (numPage <= totalPages) {
        idList = idList.splice((numPage - 1) * maxItems, maxItems);
        dataList = await spotifyHelper.getInfosByIdList(tipo, idList);
      }
    }

    res.render('conteudo', { list: dataList, listFavorites: idList, numPage: numPage, totalPages: totalPages , idNav: 'navFav'});
  } catch (err) {
    res.sendStatus(500);
    throw err;
  }

});

module.exports = router;
