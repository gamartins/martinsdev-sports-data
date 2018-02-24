var express = require('express');
var router = express.Router();

var axios = require('axios');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env]
var apiUrl = config.apiUrl

router.get('/', function(req, res, next) {
  res.redirect('tournaments')
});

router.get('/tournaments', function(req, res, next) {

  axios.default.get(`${apiUrl}/api/v1/tournaments`)
  .then(response => {
    const tournaments = response.data
    res.render('index', { title: 'Tournaments', data: tournaments })
  })
  .catch(error => res.render('index', { error: error, message: error.message }))
});

router.get('/tournaments/:id', function(req, res, next) {
  axios.default.get(`${apiUrl}/api/v1/tournaments/${req.params.id}`)
  .then(response => {
    const teams = []
    
    response.data.forEach(element => {
      const team = element.Team
      team.group_name = element.Group.name
      team.name = team.name.slice(0,20)
      teams.push(team)
    });

    res.render('teams', { title: 'Teams', data: teams })
  })
  .catch(error => res.send(error))
})

module.exports = router;
