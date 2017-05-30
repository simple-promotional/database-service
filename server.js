'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Create server
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

//Connect to DB
server.app.db = mongojs('db', ['banners']);

//Register route plugin
server.register([
    require('./routes/banners.js')
], (err) => {
    if (err) {
        throw err;
    }

    //Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log("Server running at ", server.info.uri);
    });
});