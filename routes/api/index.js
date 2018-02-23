var express = require('express');
var router = express.Router();
var axios = require('axios');

var CurrentSeason = require('../../models/index').CurrentSeason
var Category = require('../../models/index').Category
var Tournament = require('../../models/index').Tournament

// Environment
const apiUrl = 'https://api.sportradar.us/soccer-xt3/eu/en'
const apiKey = 'f3u5exz7c67cn5b55q8muku3'
const responseFormat = 'json'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ value: 'Oi' })
});

router.get('/tournaments', (req, res, next) => {
  Tournament.findAll({
    attributes: ['id', 'name' ],
    include: [ Category, CurrentSeason ]
  }).then(data => {
    if(data.length > 0) {
      console.log(data.length)
      res.send(data)
    }
    else {
      axios.default.get(`${apiUrl}/tournaments.${responseFormat}?api_key=${apiKey}`)
      .then(response => {
        const tournaments = response.data.tournaments
      
        tournaments.forEach(tournament => {
          CurrentSeason.findOrCreate({
            where: { id: tournament.current_season.id },
            defaults: tournament.current_season
          })
          .then(() => Category.findOrCreate({
            where: { id: tournament.category.id },
            defaults: tournament.category
          }))
          .then(() => Tournament.findOrCreate({
            where: { id: tournament.id },
            defaults: {
              id: tournament.id,
              name: tournament.name,
              category: tournament.category.id,
              current_season: tournament.current_season.id
            }
          }))
        });
      
        res.send(response.data.tournaments)
      })
      .catch(error => {
        console.log(error)
        res.status(500).send({ Error: 'Generic error'})
      })
    }
  })

})

module.exports = router;