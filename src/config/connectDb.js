import mongoose from 'mongoose';
import bluebird from 'bluebird';

/* 
  connect MongoDB
*/
let connectDb = () => {
    mongoose.Promise = bluebird;

    let DB_CONNECTION = 'mongodb';
    let DB_PORT = '27017';
    let DB_HOST = 'localhost';
    let DB_NAME = 'chat_online';
    let DB_USERNAME = '';
    let DB_PASSWORD = '';
    // mongodb://localhost:27017/chat_online
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    return mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
}
module.exports = connectDb;