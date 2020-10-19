import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes';
let app = express();
// connect mongoose db
connectDb();
// ConfigviewEngine
configViewEngine(app);

// init all routes
initRoutes(app);

let host = 'localhost';
let port = 2509;


app.listen(port, host, () => {
    console.log(`Starting at ${host}:${port}/`);
})