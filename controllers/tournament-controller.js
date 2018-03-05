var exports = module.exports = app = {}

var axios = require('axios');

var Sequelize = require('sequelize')
var Op = Sequelize.Op

var moment = require('moment')

var Tournament = require('../models/index').Tournament
var Category = require('../models/index').Category
var CurrentSeason = require('../models/index').CurrentSeason
var Result = require('../models/index').Result
var TeamResult = require('../models/index').TeamResult
var Team = require('../models/index').Team

// Environment
apiUrl = 'https://api.sportradar.us/soccer-xt3/eu/en'
apiKey = 'f3u5exz7c67cn5b55q8muku3'
responseFormat = 'json'

exports.getTournamentsById = function(id) {
    return _getTournamentsFromDatabaseById(id)
}

function _getTournamentsFromDatabaseById(id) {
    const queryOptions = {
        where: { id: id },
        attributes: ['id', 'name' ],
        include: [ Category, CurrentSeason ]
    }

    const promise = Tournament.findAll(queryOptions).then(data => Promise.resolve(data[0]));

    return promise
}

exports.getTournaments = function() {
    const promise = _getTournamentsFromDatabase()
    .then(data => {
        if(data.length == 0)
            return _fillTournamentsDatabase().then(() => _getTournamentsFromDatabase())
        else
            return Promise.resolve(data)
    }).catch(error => {
        console.log(error)
        return error.message
    })

    return promise
}

function _getTournamentsFromDatabase() {
    const queryOptinos = {
        attributes: ['id', 'name' ],
        include: [ Category, CurrentSeason ]
    }

    const promise = Tournament.findAll(queryOptinos)

    return promise
}

function _fillTournamentsDatabase() {
    const request = `${apiUrl}/tournaments.${responseFormat}?api_key=${apiKey}`
    const promise = axios.default.get(request).then(response => {
        const tournaments = response.data.tournaments
        const promises = []

        tournaments.forEach(tournament => promises.push(_createTournament(tournament)));
        
        return Promise.all(promises)
    })

    return promise
}

function _createTournament(tournament) {
    return CurrentSeason.findOrCreate({
        where: { id: tournament.current_season.id },
        defaults: tournament.current_season
    })
    .then(() => Category.findOrCreate({
        where: { id: tournament.category.id },
        defaults: tournament.category
    }))
    .then(() => Tournament.findOrCreate({
        where: { id: tournament.id }, defaults: {
            id: tournament.id,
            name: tournament.name,
            category: tournament.category.id,
            current_season: tournament.current_season.id
        }
    }))
}

exports.getResults = function(tournament, team) {
    return _findResultsDatabase(tournament, team).then(data => {
        if(data.length == 0 || _checkDate(data[0].createdAt))
            return _fillResultsDatabase(tournament).then(() => _findResultsDatabase(tournament, team))
        else
            return Promise.resolve(data)
    })
}

function _checkDate(date) {
    date = moment(date)
    const now = moment().format()
    const isAfter = moment(now).isAfter(date, 'day')
    
    return isAfter
}

function _findResultsDatabase(tournament, team) {
    team = team || null

    const queryParams = {
        include: [
            { model: Team, as: 'home_team' },
            { model: Team, as: 'away_team' }
        ],
        order: [
            [ 'round_number', 'DESC' ]
        ]
    }

    if(team) {
        queryParams.where = {
            [Op.or]: [ { home_id: team }, { away_id: team } ]
        }
    }

    return Result.findAll(queryParams)
}

function _fillResultsDatabase(tournament) {
    const url = `${apiUrl}/tournaments/${tournament}/results.${responseFormat}?api_key=${apiKey}`
        
    return axios.default.get(url).then(response => {
        const resultsList = response.data.results
        const promisesList = []
    
        resultsList.forEach(tempResult => {
            const result = {
                id: tempResult.sport_event.id,
                season_id: tempResult.sport_event.season.id,
                scheduled: tempResult.sport_event.scheduled,
                round_type: tempResult.sport_event.tournament_round.type,
                round_number: tempResult.sport_event.tournament_round.number,
                status: tempResult.sport_event_status.status,
                match_status: tempResult.sport_event_status.match_status,
                home_id: tempResult.sport_event.competitors[0].id,
                home_score: tempResult.sport_event_status.home_score,
                away_id: tempResult.sport_event.competitors[1].id,
                away_score: tempResult.sport_event_status.away_score
            }    

            if(result.match_status == 'ended')
                promisesList.push(_saveResultToDatabase(result))
        });

        return Promise.all(promisesList)
    })
}

function _saveResultToDatabase(result){
    const teamResultHome = { team_id: result.home_id, result_id: result.id }
    const teamResultAway = { team_id: result.away_id, result_id: result.id }

    const promise = Result.findOrCreate({
        where: { id: result.id },
        defaults: result    
    }).spread((result, created) => {
        if(created)
            return TeamResult.create(teamResultHome).then(() => TeamResult.create(teamResultAway))
        else
            Promise.resolve()
    })

    return promise
}

exports.getSchedule = function(tournament, team) {
    const url = `${apiUrl}/tournaments/${tournament}/schedule.${responseFormat}?api_key=${apiKey}`

    return axios.default.get(url).then(response => response.data)
}
