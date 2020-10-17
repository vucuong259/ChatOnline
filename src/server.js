import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
let app = express();
// connect mongoose db
connectDb();
// ConfigviewEngine
configViewEngine(app);

let host = 'localhost';
let port = 2509;

app.get('/', async(req, res) => {
    return res.render('main/master');
})
app.get('/login-register', async(req, res) => {
    return res.render('auth/master');
})

app.listen(port, host, () => {
    console.log(`Starting at ${host}:${port}/`);
})