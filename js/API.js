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
    let collapsible = '';
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
        collapsible += collStandings(group, char[i]);
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
    $('#miniStandings').html(collapsible);
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

function collStandings(obj, group) {
    return `<li>
                <div class="collapsible-header">
                    Group ${group}
                </div>
                <div class="collapsible-body">
                    ${clubStandings(obj)}
                </div>
            </li>
    `;
}

function tableHead(obj) {
    let head = '';
    obj.forEach(i => {
        head += `
        <th clubId="${i.id}" class="standings-club">
            <img src="${i.src}" alt="" class="crest">
            <p class="standings-name truncate">${i.name}</p>
        </th>
        `;
    });
    return head;
}

function tableBody(obj) {
    let body = '';
    obj.forEach(i => {
        body += `
        <td class="valign-wrapper">
            <p class="center-align">
                ${i}
            </p>
        </td>
        `;
    });
    return body;
}


function clubStandings(obj) {
    let converter = {
        head: [],
        mp: [],
        w: [],
        d: [],
        l: [],
        gf: [],
        ga: [],
        gd: [],
        pts: []
    }
    obj.forEach(i => {
        converter.head.push({
            id: i.team.id,
            name: i.team.name,
            src: i.team.crestUrl
        });
        converter.mp.push(i.playedGames);
        converter.w.push(i.won);
        converter.d.push(i.draw);
        converter.l.push(i.lost);
        converter.gf.push(i.goalsFor);
        converter.ga.push(i.goalsAgainst);
        converter.gd.push(i.goalDifference);
        converter.pts.push(i.points);
    });
    return `
        <table class="responsive-table mini-standings">
            <thead>
                <tr>
                    <th style="text-align: left;">Club</th>
                    ${tableHead(converter.head)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="head">MP</td>
                    ${tableBody(converter.mp)}
                </tr>
                <tr>
                    <td class="head">W</td>
                    ${tableBody(converter.w)}
                </tr>
                <tr>
                    <td class="head">D</td>
                    ${tableBody(converter.d)}
                </tr>
                <tr>
                    <td class="head">L</td>
                    ${tableBody(converter.l)}
                </tr>
                <tr>
                    <td class="head">GF</td>
                    ${tableBody(converter.gf)}
                </tr>
                <tr>
                    <td class="head">GA</td>
                    ${tableBody(converter.ga)}
                </tr>
                <tr>
                    <td class="head">GD</td>
                    ${tableBody(converter.gd)}
                </tr>
                <tr>
                    <td class="head">Pts</td>
                    ${tableBody(converter.pts)}
                </tr>
            </tbody>
        </table>
    `;
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
    $(`th[clubId]`).click(function() {
        clubInfo(parseInt($(this).attr('clubId')));
    });
    $(`tr[id]`).click(function() {
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