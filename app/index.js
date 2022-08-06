const crypto = require("crypto");
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    const id = crypto.randomBytes(16).toString("hex");
    res.send(`Hello! Session id: ${id}`)
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});