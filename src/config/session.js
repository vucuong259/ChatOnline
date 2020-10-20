import session from 'express-session';
import connectMongo from 'connect-mongo';

let DB_CONNECTION = 'mongodb';
let DB_PORT = '27017';
let DB_HOST = 'localhost';
let DB_NAME = 'chat_online';
let DB_USERNAME = '';
let DB_PASSWORD = '';
// mongodb://localhost:27017/chat_online
let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let MongoStore = connectMongo(session);
/**
  This variable is where save session, in this case is mongodb     
*/
let sessionStore = new MongoStore({
        url: URI,
        autoReconnect: true
    })
    /**
     * Config view engine for app
     * @param app from exactly express module
     */
let configSession = (app) => {
    app.use(session({
        key: 'express.sid',
        secret: 'mySecret',
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }));
}
module.exports = configSession