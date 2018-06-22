const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mc = require( `./controllers/messages_controller` );
const createInitialSession = require('./middlewares/session');
const filterProfanity = require('./middlewares/filter');
const port = 1337;
require('dotenv').config();

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use( session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 }
}));

app.use( createInitialSession );
//This below is an optional way of doing what was just done above.
app.use( (req, res, next) => {
    const { method } = req;
    if (method === 'POST'||method === 'PUT') {
        filterProfanity(req, res, next)
    } else {
        next()
    }
} )

app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );
app.get( "/api/messages/history", mc.history );


app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );