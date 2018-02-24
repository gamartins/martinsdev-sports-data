var exports = module.exports = app = {}

var axios = require('axios');

var Tournament = require('../models/index').Tournament
var Category = require('../models/index').Category
var CurrentSeason = require('../models/index').CurrentSeason

// Environment
apiUrl = 'https://api.sportradar.us/soccer-xt3/eu/en'
apiKey = 'f3u5exz7c67cn5b55q8muku3'
responseFormat = 'json'

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
