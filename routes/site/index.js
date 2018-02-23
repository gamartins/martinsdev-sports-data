var express = require('express');
var axios = require('axios');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.default.get('http://localhost:3000/api/v1/tournaments')
  .then(response => {
    const tournaments = response.data
    res.render('index', { title: 'Tournaments', data: tournaments })
  })
  .catch(error => res.render('index', { error: error, message: error.message }))
});

module.exports = router;
