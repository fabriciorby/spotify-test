var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

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
    let data = await dbHelper.getFavorites(userId, tipo);
    if (!data)
      res.sendStatus(403);
    console.log(data);
    res.send(data);
  } catch (err) {
    res.sendStatus(500);
    throw err;
  }

});
module.exports = router;
