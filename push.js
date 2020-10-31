const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BP9lmGds7s3uS3uxsdu6_TZlARYTigZneyS7WbA2GcQAN1ypIUfHvYFOTcYTPLNkxOe8JT6D2_eXzNNNPDntORc",
    "privateKey": "I4wX1ohHlo0Bw-LytyHkljQhQRL3xJHcRu0G2vGn9UE"
};


webPush.setVapidDetails(
    'mailto:danarvirkan@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/ck7RiUm4zls:APA91bE0cCqIXTzQjPetC_vcObmqKlMvOzFS5NYe3YCZm-IjHawyHHtZuTSVuYZ3Jt0lbQmNH4Zr-XjrOAX94gmqiqrUoksZkY09Sr_bgyWKjSwIFob0u6ZhFBexxo4Vio58q6mwDXDs",
    "keys": {
        "p256dh": "BKZWR67RMuj8ztJ+/yrT+NUy1mz7py7oeAcDAd2W3D1/O2L7FcX23zX1gKALz+DkkCzkpGrvxpB92jPB5bO+LC8=",
        "auth": "AsJHmcpJtjR9qQquL2hwVg=="
    }
};
const payload = 'Cek Pertandingan Champions League Malam ini !';

const options = {
    gcmAPIKey: '206503121855',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);