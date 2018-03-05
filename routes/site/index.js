var express = require('express');
var router = express.Router();

var axios = require('axios');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env]
var apiUrl = config.apiUrl

const teamController = require('../../controllers/team-controller')

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
    const tournament = req.params.id
    
    response.data.forEach(element => {
      const team = element.Team
      team.group_name = element.Group.name
      team.name = team.name.slice(0,20)
      teams.push(team)
    });

    res.render('teams', { title: 'Teams', tournament: tournament, teams: teams })
  })
  .catch(error => res.send(error))
})

router.get('/tournaments/:id/team/:team_id/:filter', function(req, res, next) {
  const filter = req.params.filter
  const tournamentId = req.params.id
  const teamId = req.params.team_id
  const teamInfoUrl = `${apiUrl}/api/v1/tournaments/${tournamentId}/team/${teamId}`
  const teamScheduleUrl = `${apiUrl}/api/v1/tournaments/${tournamentId}/schedule/${teamId}`

  const data = {
    tournament: tournamentId,
    team: teamId
  }
  
  axios.default.get(teamInfoUrl).then(response => {
    const results = response.data;
    
    switch (filter) {
      case 'home':
        data.results = results.filter(result => result.home_id == teamId).slice(0,5)
        data.stats = teamController.getStats(teamId, data.results)
        break

      case 'away':
        data.results = results.filter(result => result.away_id == teamId).slice(0,5)
        data.stats = teamController.getStats(teamId, data.results)
        break
    
      default:
        data.results = results.slice(0,5)
        data.stats = teamController.getStats(teamId, data.results)
        break
    }

    return axios.default.get(teamScheduleUrl)
  }).then(response => {
    const schedules = response.data.sport_events;

    switch(filter) {
      case 'home':
        data.schedules = schedules
          .filter(schedule => schedule.status == 'not_started' && schedule.competitors[0].id == teamId)
          .slice(0, 5)
        break
      
      case 'away':
        data.schedules = schedules
          .filter(schedule => schedule.status == 'not_started' && schedule.competitors[1].id == teamId)
          .slice(0,5)
        break

      default:
        data.schedules = schedules.filter(schedule => {
          const condition01 = schedule.status == 'not_started'
          const condition02 = schedule.competitors[0].id == teamId
          const condition03 = schedule.competitors[1].id == teamId
          
          if (condition01 && (condition02 || condition03)) return true
          else return false
        }).slice(0, 5)
        break
    }

    res.render('results', { data: data })
  })
  .catch(error => res.send(error))
})

module.exports = router;
