import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets';
import passportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';
import events from 'events';
import * as configApp from './config/app'


let app = express();
// set max connection events listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_events_listeners;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);
// connect mongoose db
connectDb();
// ConfigSession
session.config(app);
// ConfigviewEngine
configViewEngine(app);
//Enable post data form request
app.use(bodyParser.urlencoded({ extended: true }));

//Enable flash message
app.use(connectFlash());
//use cookie parser
app.use(cookieParser());

//Config passport Js
app.use(passport.initialize());
app.use(passport.session());
// init all routes
initRoutes(app);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: 'mySecret',
    store: session.sessionStore,
    success: (data, accept) => {
        if(!data.user.logged_in){
            return accept("Invalid user.", false);
        }
        return accept(null,true);
    },
    fail: (data, message, error, accept) => {
        if(error){
            console.log("failed connection to socket.io:", message);
            return accept(new Error(message), false);
        }
    }
}));
// init all socket
initSockets(io);

let host = 'localhost';
let port = 2509;

server.listen(port, host, () => {
    console.log(`Starting at ${host}:${port}/`);
});

// import pem from 'pem';
// import https from 'https';
// pem.config({
//     pathOpenSSL: 'C:/Users/Vu Manh Cuong/AppData/Local/Programs/Git/usr/bin/openssl'
// })

// pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
//     if (err) {
//         throw err
//     }
//     let app = express();
//     // connect mongoose db
//     connectDb();
//     // ConfigSession
//     configSession(app);
//     // ConfigviewEngine
//     configViewEngine(app);
//     //Enable post data form request
//     app.use(bodyParser.urlencoded({ extended: true }));

//     //Enable flash message
//     app.use(connectFlash());
//     //Config passport Js
//     app.use(passport.initialize());
//     app.use(passport.session());
//     // init all routes
//     initRoutes(app);

//     let host = 'localhost';
//     let port = 2509;

//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port, host, () => {
//         console.log(`Starting at ${host}:${port}/`);
//     });
// })