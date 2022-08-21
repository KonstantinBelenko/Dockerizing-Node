const crypto = require("crypto");
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', function(req, res) {

    // TODO: Fetch data from db server

    // Fetch data

    // Send it back

    const id = crypto.randomBytes(16).toString("hex");
    res.send(`Hello! Session id: ${id}`)
});

app.listen(port, function() {
    console.log(`Front-end listening on port ${port}!`)
});