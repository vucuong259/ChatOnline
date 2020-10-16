import express from 'express';
let app = express();
let host = 'localhost';
let port = 2509;

app.get('/', (req, res) => {
    res.send('abc');
})

app.listen(port, host, () => {
    console.log(`Starting at ${host}:${port}/`);
})