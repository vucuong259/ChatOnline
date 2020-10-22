import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';
import passport from 'passport';

import pem from 'pem';
import https from 'https';
pem.config({
    pathOpenSSL: 'C:/Users/Vu Manh Cuong/AppData/Local/Programs/Git/usr/bin/openssl'
})

pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
    if (err) {
        throw err
    }
    let app = express();
    // connect mongoose db
    connectDb();
    // ConfigSession
    configSession(app);
    // ConfigviewEngine
    configViewEngine(app);
    //Enable post data form request
    app.use(bodyParser.urlencoded({ extended: true }));

    //Enable flash message
    app.use(connectFlash());
    //Config passport Js
    app.use(passport.initialize());
    app.use(passport.session());
    // init all routes
    initRoutes(app);

    let host = 'localhost';
    let port = 2509;

    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port, host, () => {
        console.log(`Starting at ${host}:${port}/`);
    });
})

// let app = express();
// // connect mongoose db
// connectDb();
// // ConfigSession
// configSession(app);
// // ConfigviewEngine
// configViewEngine(app);
// //Enable post data form request
// app.use(bodyParser.urlencoded({ extended: true }));

// //Enable flash message
// app.use(connectFlash());
// //Config passport Js
// app.use(passport.initialize());
// app.use(passport.session());
// // init all routes
// initRoutes(app);

// let host = 'localhost';
// let port = 2509;

// app.listen(port, host, () => {
//     console.log(`Starting at ${host}:${port}/`);
// });