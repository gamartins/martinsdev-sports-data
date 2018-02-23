var express = require('express');
var router = express.Router();

var axios = require('axios');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env]
var apiUrl = config.apiUrl

/* GET home page. */
router.get('/', function(req, res, next) {

  axios.default.get(`${apiUrl}/api/v1/tournaments`)
  .then(response => {
    const tournaments = response.data
    res.render('index', { title: 'Tournaments', data: tournaments })
  })
  .catch(error => res.render('index', { error: error, message: error.message }))
});

module.exports = router;
