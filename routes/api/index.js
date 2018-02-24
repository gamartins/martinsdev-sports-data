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
  Tournament.findAll({ where: { id: req.params.id } })
  .then(data => {
    if(data.length == 0)
      throw new Error('Empty tournament table')

    else
      return Group.findAll({ where: { season_id: data[0].current_season } })
      .then(groups => {
        if(groups.length == 0) {
          axios.default.get(`${apiUrl}/tournaments/${req.params.id}/info.${responseFormat}?api_key=${apiKey}`).then(response => {
            const season_id = response.data.season.id
            const groups = response.data.groups

            groups.forEach(group => {
              Group.create({ name: group.name, season_id: season_id }).then(createdGroup => {
                group.teams.forEach(team =>
                Team.findOrCreate({
                  where: { id: team.id },
                  defaults: team
                })
                .then(createdTeam => GroupTeam.create({ group_id: createdGroup.id, team_id: createdTeam[0].id })))
              })
            })
            
            res.send(response.data)
          })
        } else {
          const groups_id = []
          groups.forEach(group => groups_id.push(group.id))

          GroupTeam.findAll({
            attributes: ['id', 'group_id', 'team_id' ],
            where: { group_id: groups_id },
            include: [ Team, Group ]
          }).then(data => res.send(data))
        }
      })
  })
  .catch(error => {
    console.log(error.message)
    res.status(500).send(error.message)
  })
})

module.exports = router;