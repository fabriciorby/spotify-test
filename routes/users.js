var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

const DBHelper = require('../dbHelper')
const dbHelper = new DBHelper();

// create application/json parser
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//display da tabela
router.post('/adicionaFavorito/:tipo/:dataId', async (req, res, next) => {
  let body = {};
  
  let tipo = req.params.tipo;
  let dataId = req.params.dataId;
  let userId = req.app.locals.userInfo.id;

  console.log(userId);

  try {
    await dbHelper.userAddFavorite(userId, dataId, tipo);
  } catch (err) {
    throw err;
  }

  res.render('favoritar');
});

module.exports = router;
