var exports = module.exports = app = {}

var axios = require('axios');

var Team = require('../models/index').Team
var Group = require('../models/index').Group
var GroupTeam = require('../models/index').GroupTeam

// Environment
apiUrl = 'https://api.sportradar.us/soccer-xt3/eu/en'
apiKey = 'f3u5exz7c67cn5b55q8muku3'
responseFormat = 'json'

exports.getTeams = function(seasonId) {
    return _getGroupsFromDatabase(seasonId).then(groups => {
        if(groups.length == 0) {
            const promise = _populateGroup(seasonId)
            .then(() => _getGroupsFromDatabase(seasonId))
            .then(response => _findGroupTeamData(response))

            return promise
        } else {
            return _findGroupTeamData(groups)
        }
    })
}

function _getGroupsFromDatabase(seasonId) {
    return Group.findAll({ where: { season_id: seasonId } })
}

function _populateGroup(id) {
    const request = `${apiUrl}/tournaments/${id}/info.${responseFormat}?api_key=${apiKey}`

    const promise = axios.default.get(request).then(response => {
        const season_id = response.data.season.id
        const groups = response.data.groups
        const createGroupsPromise = []

        groups.forEach(group => {
            const promise = Group.create({ name: group.name, season_id: season_id })
            .then(createdGroup => _populateTeams(createdGroup, group.teams))

            createGroupsPromise.push(promise)
        })

        return Promise.all(createGroupsPromise)
    })

    return promise
}

function _populateTeams(createdGroup, teams) {
    const createTeamsPromise = []
                
    teams.forEach(team => {
        const promise = Team.findOrCreate({
            where: { id: team.id },
            defaults: team
        }).then(createdTeam => {
            const groupTeam = { group_id: createdGroup.id, team_id: createdTeam[0].id } 
            return GroupTeam.create(groupTeam)
        })

        createTeamsPromise.push(promise)    
    })

    return Promise.all(createTeamsPromise)
}

function _findGroupTeamData(groups) {
    const groups_id = Array.from(groups, group => group.id )

    return GroupTeam.findAll({
        attributes: [ 'id', 'group_id', 'team_id' ],
        where: { group_id: groups_id },
        include: [ Team, Group ]
    })
}