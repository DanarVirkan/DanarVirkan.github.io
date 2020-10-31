import { loadMatches } from './API.js';
import { loadPage } from './main.js';
import { removeClub, saveClub } from './favouriteDB.js';

function renderClub(data) {
    let isi = '';
    data.forEach((i, index) => {
        isi += `
            <div class="col s6 m3">
                <div index="${index}" club class="card hoverable">
                    <div class="card-content" style="padding:15px;display:flex">
                        <img src="${source(i.ID)}" style="height:100px;margin:auto" class="responsive-img">
                    </div>
                </div>
            </div>
        `;
    });

    if (data.length < 1) {
        isi = `
        <div class="col s12 valign-wrapper" style="height:100vh">
            <h4 class="center-align" style="width:100%">"No Saved Club"</h4>
        </div>
        `;
    }
    $('#favClub').html(isi);

    $('div[club]').click(function() {
        let id = parseInt($(this).attr('index'));
        let obj = data[id];

        $('#crest').attr('src', source(obj.ID));
        $('#clubName').html(obj.club_name);
        const squad = obj.squad;
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
        favouriteButton(1, parseInt(obj.ID));
        $('#info').modal('open');
    });
}


function disableFav(data) {
    if (data !== undefined) {
        $('#btnInfo').attr('disabled', 'disabled');
    } else {
        $('#btnInfo').removeAttr('disabled');
    }
}

function source(id) {
    switch (id) {
        case 1105:
            return '/src/crest.png';
        case 1874:
            return '/src/crest.png';
        case 1885:
            return '/src/crest.png';
        case 4450:
            return '/src/crest.png';
        case 5100:
            return '/src/crest.png';
        case 5142:
            return '/src/crest.png';
        case 5726:
            return '/src/crest.png';
        case 5804:
            return '/src/crest.png';
        case 5947:
            return '/src/crest.png';
        case 7282:
            return '/src/crest.png';
        case 7472:
            return '/src/crest.png';
        case 7473:
            return '/src/crest.png';
        case 7480:
            return '/src/crest.png';
        case 7482:
            return '/src/crest.png';
        case 7518:
            return '/src/crest.png';
        case 8912:
            return '/src/crest.png';
        case 8983:
            return '/src/crest.png';
        case 8984:
            return '/src/crest.png';
        case 8985:
            return '/src/crest.png';
        case 8920:
            return '/src/crest.png';
        default:
            return `https://crests.football-data.org/${id}.svg`;
    }
};

function formatDate(tgl) {
    const date = new Date(tgl);
    const day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${day[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]}<br>${date.toLocaleTimeString()}`;
}

function favouriteButton(code, obj = null) {
    const button = $('#btnInfo');
    const remove = $('#btnInfoRemove');
    if (code == 0) {
        // SAVE
        button.css('display', 'inline');
        remove.css('display', 'none');

        button.one('click', function() {
            saveClub(obj);
            $(this).attr('disabled', 'disabled');
        });
    } else {
        // REMOVE
        button.css('display', 'none');
        remove.css('display', 'inline');

        remove.one('click', function() {
            removeClub(obj);
        });
    }
}

function refreshPage(stage, group = null) {
    $('#refresh').click(function() {
        if (stage == 'standings') {
            loadPage('standings');
        } else {
            loadMatches(stage, group);
        }
    });
}

export { renderClub, disableFav, source, formatDate, favouriteButton, refreshPage };