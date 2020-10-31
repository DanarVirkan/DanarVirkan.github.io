import { renderClub, disableFav } from './control.js'
const idb = require('./idb.js');
const dbPromise = idb.open("CLM", 1, function(upDB) {
    if (!upDB.objectStoreNames.contains("club")) {
        upDB.createObjectStore("club", {
            keyPath: 'ID'
        });
    }
});

function removeClub(id) {
    dbPromise.then(function(db) {
        const tx = db.transaction("club", "readwrite");
        const store = tx.objectStore("club");
        store.delete(id);
        return tx.complete;
    }).then(function() {
        getClub();
        $('#info').modal('close');
    });
}

function saveClub(obj) {
    dbPromise.then(function(db) {
        const tx = db.transaction("club", "readwrite");
        const store = tx.objectStore("club");
        store.put(obj);
        return tx.complete;
    });
}

function getClubStatus(id) {
    dbPromise.then(function(db) {
        const tx = db.transaction("club", "readonly");
        const store = tx.objectStore("club");
        return store.get(id);
    }).then(function(data) {
        disableFav(data);
    });
}

function getClub() {
    dbPromise.then(function(db) {
        const tx = db.transaction("club", "readonly");
        const store = tx.objectStore("club");
        return store.getAll();
    }).then(function(data) {
        renderClub(data);
    });
}
export { removeClub, saveClub, getClubStatus, getClub };