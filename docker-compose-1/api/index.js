const crypto = require("crypto");
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/v1/list', function(req, res) {

    // TODO: Read db.json file and resnonse with list
});

app.listen(port, function() {
    console.log(`API listening on port ${port}!`)
});