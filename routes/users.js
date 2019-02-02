var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

// create application/json parser
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//display da tabela
router.post('/adicionaFavorito/:tipo', async (req, res, next) => {
  let tipo = req.params.tipo;

  console.log(req.body);

  res.send(req.body);
  //res.render('conteudo', { title: title, list: listAlbum, user: userInfo });
});

module.exports = router;
