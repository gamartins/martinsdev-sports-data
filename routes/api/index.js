var express = require('express');
var router = express.Router();
var axios = require('axios');

var CurrentSeason = require('../../models/index').CurrentSeason
var Category = require('../../models/index').Category
var Tournament = require('../../models/index').Tournament
var GroupTeam = require('../../models/index').GroupTeam
var Team = require('../../models/index').Team
var Group = require('../../models/index').Group

// Environment
const apiUrl = 'https://api.sportradar.us/soccer-xt3/eu/en'
const apiKey = 'f3u5exz7c67cn5b55q8muku3'
const responseFormat = 'json'

// Controllers
const tournamentController = require('../../controllers/tournament-controller')
const teamController = require('../../controllers/team-controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ value: 'Oi' })
});

router.get('/tournaments', (req, res, next) => {  
  tournamentController.getTournaments()
  .then(data => res.send(data))
  .catch(error => {
    console.log(error)
    res.status(500).send({ Error: 'Generic error'})
  })
})

router.get('/tournaments/:id', (req, res, next) => {
  const id = req.params.id

  tournamentController.getTournamentsById(id)
  .then(tournament => teamController.getTeams(tournament.CurrentSeason.id))
  .then(data => res.send(data))
  .catch(error => {
    console.log(error)
    res.status(500).send(error.message)
  })
})

module.exports = router;