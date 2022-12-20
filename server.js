const webpush = require('web-push');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

const vapidKeys = {
    "publicKey": "BDfffC8Hll6UQtCyCrYk1gDEb3l25UaocTfnduDxtl5gyJGy07yyfR8Xji8hi1JzCoEcoYoQAeMfxwLt2NWNXdc",
    "privateKey": "lnGA11GzJijtr3EuVTuMv6xVXGHZSW1tB7jSz29KkOk"
}

webpush.setVapidDetails(
    'mailto:urielcrow@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/************************************** */
const handlerResponse = (res,data,code = 200)=>{
    res.status(code).send(data);
}

/************************************** */

const savePush = (req,res) =>{

    const name = Math.floor(Date.now() / 1000);

    const tokenBrowser = req.body.token;
   
    const data = JSON.stringify(tokenBrowser,null,2);

    // fs.writeFile(`./tokens/token-${name}.json`,data,(err)=>{
    //     console.log(err)
    // });

    const id = req.body.id;

    fs.writeFile(`./tokens/token-${id}-${name}.json`,data,(err)=>{
        //console.log(err)
    });

}

const sendPush = (req,res) =>{
    const payload = {
        "title": "Saludos",
        "body": "Holi",
        "image": "https://sun9-9.userapi.com/c855128/v855128266/1b00a9/0UdMXtJtnLo.jpg",
        "data": {
            "url": "http://localhost:3000/inicio"
          }
        // "actions": [{
        //     "action": "explore",
        //     "title": "Go to the site"
        // }]
    }


    const directoryPath = path.join(__dirname,'tokens');

    fs.readdir(directoryPath,(err,files)=>{
        if(err)
            console.log(err);
        
        files.forEach(file=>{
            const tokenRaw = fs.readFileSync(`${directoryPath}/${file}`);
            const tokenParse = JSON.parse(tokenRaw);

            webpush.sendNotification( tokenParse, JSON.stringify(payload))
            .then(res => {
                // console.log('Enviado !!');
            }).catch(err => {
                // console.log('Error', err);
            });

        });
        
    });

}

/**************************************** */

app.route('/notificaciones').post(savePush);
app.route('/send').get(sendPush);




// const enviarNotificacion = (req, res) => {

//     const pushSubscription = {
//         endpoint: 'https://fcm.googleapis.com/fcm/send/cvnWI1iv1n4:APA91bEXvhI0HVrovVh82lI4HhcRKGT6dh28Bs3PpUAthvy68tz54PxZaVNj18cIOk8rK6EuAxZ3DCBdHiFM-v3y6cyD_s--JON13JP8zpaBMJE1fZUmijtzwUIst3QWxkpWgeX4VnGE',
//         keys: {
//             auth: 'H1UaF1zNA1jPlVJw6nLAGQ',
//             p256dh: 'BJIAsd0i40iAtHUinrAzNeR8UGb5HG8oEHCkcyPOda67i9UVIUhtWpD0ULEnITYX9pT8TlMTT6-ZdZFMO0-r7QE'
//         }
//     };

//     const payload = {
//         "notification": {
//             "title": "😄😄 Saludos",
//             "body": "Subscribete a mi canal de YOUTUBE",
//             "vibrate": [100, 50, 100],
//             "image": "https://avatars2.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4",
//             "actions": [{
//                 "action": "explore",
//                 "title": "Go to the site"
//             }]
//         }
//     }

//     webpush.sendNotification(
//         pushSubscription,
//         JSON.stringify(payload))
//         .then(res => {
//             console.log('Enviado !!');
//         }).catch(err => {
//             console.log('Error', err);
//         })

//     res.send({ data: 'Se envio subscribete!!' })

// }

//app.route('/api/enviar').post(enviarNotificacion);


app.listen( port , () => {
    console.log("Port: " + port);
});

