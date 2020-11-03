require('./materialize.min.js');
import { loadMatches, loadStandings } from './API.js';
import { getClub } from './favouriteDB.js';

$(document).ready(function() {
    loadPage('home');

    $('.sidenav').sidenav();
    $.ajax({
        url: '/nav.html',
        method: 'GET',
        success: function(res) {
            $('nav ul').each(function() {
                $(this).html(res);
            });

            const navBTN = $('nav ul a');
            navBTN.click(function() {
                if ($(this).attr('active') != 'true') {
                    navBTN.removeAttr('active');
                    $(this).attr('active', 'true');
                    $('.sidenav').sidenav('close');
                    let loc = $(this).attr('href').substr(1);
                    loadPage(loc);
                }
            });
        }
    });
    $('.modal').modal({
        dismissible: false
    });
});

function capt(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function loadPage(loc) {
    if (loc != 'matches') {
        $('.container').removeAttr('tabbed');
    } else {
        $('.container').attr('tabbed', 'true');
    }
    $.ajax({
        url: `page/${loc}.html`,
        method: 'GET',
        success: function(res) {
            $('#isi').html(res);
            switch (loc) {
                case 'home':
                    $(`a[id='link']`).click(function() {
                        loadPage($(this).attr('href').substr(1));
                    });
                    break;
                case 'matches':
                    const page = ['PRELIMINARY_SEMI_FINALS', '1ST_QUALIFYING_ROUND', 'PLAY_OFF_ROUND', 'GROUP_STAGE'];
                    page.forEach(i => {
                        if (i == 'GROUP_STAGE') {
                            loadMatches(i, 'A');
                        } else {
                            loadMatches(i);
                        }
                    });

                    $('.tabs').tabs({
                        swipeable: true
                    });
                    break;
                case 'standings':
                    loadStandings();
                    $('.collapsible').collapsible();
                    break;
                case 'favourites':
                    getClub();
                    break;
            }
            $('#judul').html((loc == 'home') ? 'Champions League Match' : 'CLM &bullet; ' + capt(loc));
        }
    });
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(function() {
                console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(function() {
                console.log("Pendaftaran ServiceWorker gagal");
            });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

// ================================================================================================================================== //

if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}

function requestPermission() {
    Notification.requestPermission().then(function(result) {
        if (result === "denied") {
            console.log("Fitur notifikasi tidak diijinkan.");
            return;
        } else if (result === "default") {
            console.error("Pengguna menutup kotak dialog permintaan ijin.");
            return;
        }

        console.log("Fitur notifikasi diijinkan.");
    });
}

navigator.serviceWorker.ready.then(() => {
    if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BP9lmGds7s3uS3uxsdu6_TZlARYTigZneyS7WbA2GcQAN1ypIUfHvYFOTcYTPLNkxOe8JT6D2_eXzNNNPDntORc")
            }).then(function(subscribe) {
                console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('p256dh')))));
                console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('auth')))));
            }).catch(function(e) {
                console.error('Tidak dapat melakukan subscribe ', e.message);
            });
        });
    }
})

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export { loadPage };