import { getClubStatus } from './favouriteDB.js'
import Filter from './filter.js';
import { source, formatDate, favouriteButton, refreshPage } from './control.js'

const BASE_URL = "https://api.football-data.org/v2/";
const STANDINGS = BASE_URL + "competitions/2001/standings";
const token = 'e73427280be641f4a634ce6e18952ce7';

const fetchAPI = url => {
    return fetch(url, {
            headers: {
                'X-Auth-Token': token
            }
        }).then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        }).then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function loadStandings() {
    $('#loading').modal('open');
    if ("caches" in window) {
        caches.match(STANDINGS).then(function(res) {
            if (res) {
                res.json().then(function(data) {
                    renderStandings(data.standings);
                })
            } else {
                fetchAPI(STANDINGS).then(data => {
                    renderStandings(data.standings);
                }).catch(error => {
                    console.log("ERR : " + error);
                    catchStandings();
                })
            }
        })
    }
}

function renderStandings(standings) {
    let table = '';
    let char = [];
    //Table
    for (let i = 0; i < standings.length; i += 3) {
        char[0] = 'A';
        char[3] = 'B';
        char[6] = 'C';
        char[9] = 'D';
        char[12] = 'E';
        char[15] = 'F';
        char[18] = 'G';
        char[21] = 'H';
        //ROW
        let row = '';
        let group = standings[i].table;
        for (let j = 0; j < group.length; j++) {
            row += `
                    <tr id="${group[j].team.id}" style="cursor:pointer">
                        ${teamInfo(group[j].team)}
                        <td>${group[j].playedGames}</td>
                        <td>${group[j].won}</td>
                        <td>${group[j].draw}</td>
                        <td>${group[j].lost}</td>
                        <td>${group[j].goalsFor}</td>
                        <td>${group[j].goalsAgainst}</td>
                        <td>${group[j].goalDifference}</td>
                        <td>${group[j].points}</td>
                    </tr>
                    `;
        }
        table += `
            <span class="card-title">
                Group ${char[i]}
            </span>
            <table class="responsive-table" style="margin-bottom:25px">
                <thead>
                    <tr>
                        <th>Club</th>
                        <th></th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                  ${row}
                </tbody>
            </table>
                `;
    }
    $('#isiStandings').html(table);
    $('#loading').modal('close');
    clubListener();
}

function catchStandings() {
    $('#isi').css('height', 'calc(100vh - 56px)');
    $('#isi').html(`
                    <div class="col s12 l6" style="display:flex;width:100%;height:100%;flex-direction:column">
                        <div style="margin:auto;display:flex;flex-direction:column;align-items:center">
                            <img src="/src/no-internet.png" style="height:250px;width:250px">
                            <h5 class="center-align" style="margin:0;color:gray">Cek koneksi internet atau Tunggu Beberapa saat</h5>
                            <button id="refresh" class="btn orange waves-effect" style="margin-top:15px">
                                <i class="fas fa-redo-alt" style="margin-right:5px"></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                `);
    $('#loading').modal('close');
    refreshPage('standings');
}

function teamInfo(team) {
    return `
    <td style="display:flex;height:50px;padding:5px">
        <img src="${team.crestUrl}" alt="" class="responsive-img" style="height:40px;margin:auto">
    </td>
    <td>
        ${team.name}
    </td>
    `;
}

function loadMatches(stage, group = null) {
    $('#loading').modal('open');
    const page = function() {
        switch (stage) {
            case 'PRELIMINARY_SEMI_FINALS':
            case 'PRELIMINARY_FINAL':
                return '#preliminary';
            case '1ST_QUALIFYING_ROUND':
            case '2ND_QUALIFYING_ROUND':
            case '3RD_QUALIFYING_ROUND':
                return '#qualifying';
            case 'PLAY_OFF_ROUND':
                return '#playoff';
            case 'GROUP_STAGE':
                return '#group';
        }
    }
    if ("caches" in window) {
        caches.match(BASE_URL + 'competitions/2001/matches?stage=' + stage + ((group != null) ? `&group=Group ${group}` : '')).then(function(res) {
            if (res) {
                res.json().then(function(data) {
                    renderMatches(data, page(), stage, group);
                })
            } else {
                fetchAPI(BASE_URL + 'competitions/2001/matches?stage=' + stage + ((group != null) ? `&group=Group ${group}` : ''))
                    .then(data => {
                        renderMatches(data, page(), stage, group);
                    })
                    .catch(error => {
                        console.log("ERR : " + error);
                        catchMatches(page(), stage, group);
                    })
            }
        })
    }
}

function renderMatches(res, page, stage, group) {
    const match = res.matches;
    let matchCard = '';
    match.forEach((i) => {
        matchCard += `
                    <div class="col s12 l6">
                        <div class="card hoverable valign-wrapper" style="height:210px">
                            <div class="card-content" style="width:100%">
                                ${matchInfo(i)}
                            </div>
                        </div>
                    </div>
                `;
    });
    const filter = new Filter(stage, group);
    $(page).html(filter.getFilter() + matchCard);
    filter.listener(page);
    $('#loading').modal('close');
    clubListener();
}

function catchMatches(page, stage, group) {
    $(page).html(`
                    <div class="col s12 l6" style="display:flex;width:100%;height:100%;flex-direction:column">
                        <div style="margin:auto;display:flex;flex-direction:column;align-items:center">
                            <img src="/src/no-internet.png" style="height:250px;width:250px">
                            <h5 class="center-align" style="margin:0;color:gray">Cek koneksi internet atau Tunggu Beberapa saat</h5>
                            <button id="refresh" class="btn orange waves-effect" style="margin-top:15px">
                                <i class="fas fa-redo-alt" style="margin-right:5px"></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                `);
    $('#loading').modal('close');
    refreshPage(stage, group);
}

// ================================================================================================================================== //

function matchInfo(match) {
    const color = function() {
        switch (match.status) {
            case 'CANCELED':
                return 'red';
            case 'SCHEDULED':
                return 'orange';
            case 'FINISHED':
                return 'green';
            case 'AWARDED':
                return 'blue';
            default:
                return 'orange';
        }
    };

    return `
    <div class="row center-align">
        <div id="club" clubID="${match.homeTeam.id}" class="col s4" style="height:100px;display:flex;cursor:pointer">
            <img src="${source(match.homeTeam.id)}" alt="crest" class="responsive-img" style="height:50px;margin:auto">
        </div>
        <div class="col s4 valign-wrapper" style="height:100px">
            <h5 style="font-weight:bold;margin:auto">${(match.status == 'FINISHED' || match.status == 'AWARDED') ? match.score.fullTime.homeTeam+' - '+match.score.fullTime.awayTeam : ''}</h5>
        </div>
        <div id="club" clubID="${match.awayTeam.id}" class="col s4" style="height:100px;display:flex;cursor:pointer">
            <img src="${source(match.awayTeam.id)}" alt="crest" class="responsive-img" style="height:50px;margin:auto">
        </div>
        <div class="col s4 truncate-mod">
            ${match.homeTeam.name}
        </div>
        <div class="col s4" style="display:flex;padding:0">
            <span class="new badge ${color()}" data-badge-caption="" style="margin:auto">
                ${match.status}
            </span>
        </div>
        <div class="col s4 truncate-mod">
            ${match.awayTeam.name}
        </div>
        <div class="col s12" style="margin-top:15px">
            ${formatDate(match.utcDate)}
        </div>
    </div>
    `;
}

// ================================================================================================================================== //
function clubListener() {
    $(`tr`).click(function() {
        clubInfo(parseInt($(this).attr('id')));
    });
    $(`div[id='club']`).click(function() {
        clubInfo(parseInt($(this).attr('clubID')));
    });
}

function clubInfo(id) {
    $('#loading').modal('open');
    if ("caches" in window) {
        caches.match(BASE_URL + 'teams/' + id).then(function(res) {
            console.log(res);
            if (res) {
                res.json().then(function(data) {
                    renderClubInfo(data, id);
                })
            } else {
                fetchAPI(BASE_URL + 'teams/' + id)
                    .then(data => {
                        renderClubInfo(data, id);
                    })
                    .catch(error => {
                        console.log("ERR : " + error);
                        catchClubInfo();
                    })
            }
        });
    }
}

function renderClubInfo(res, id) {
    getClubStatus(id);
    $('#crest').attr('src', source(id));
    $('#clubName').html(res.name);
    const squad = res.squad;
    let list = '';
    squad.forEach(i => {
        list += `
                        <div class="col s12 m6 l4 center-align" style="padding:10px">
                            <p class="grey-text" style="margin: 0;text-transform:uppercase">${(i.role == 'PLAYER') ? i.position : i.role}</p>
                            <p style="margin: 0;">${i.name}</p>
                        </div>
                    `;
    });
    if (squad.length < 1) {
        list = `
                    <div class="col s12 center-align" style="padding:10px">
                        <p style="margin: 0;">" DATA SQUAD TIDAK ADA "</p>
                    </div>
                    `;
    }
    $('#squad').html(list);
    $('#loading').modal('close');
    $('#info').modal('open');
    const obj = {
        ID: id,
        club_name: res.name,
        squad: squad
    };
    favouriteButton(0, obj);
}

function catchClubInfo() {
    $('#loading').modal('close');
    M.toast({ html: 'Cek koneksi internet atau Tunggu Beberapa saat...', classes: 'rounded' });
}

export { loadMatches, loadStandings };