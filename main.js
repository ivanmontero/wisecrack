// Module imports
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var handlebars = require("handlebars");

// Other file imports
// require('./filename.js')();
var Game = require("./game.js");

var port = 8080;
var socketEventHandlers;

app.use(express.static("static"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/select.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});

function onConnect(socket) {
    console.log("user connected");
    for(var e in socketEventHandlers) 
        socket.on(e, socketEventHandlers[e]);
}

function onDisconnect() {
    console.log("user disconnected");
}

function addIOEventHandlers(events) {
    for(var e in events) io.on(e, events[e]);
}

function addSocketEventHandlers(events) {
    socketEventHandlers = events;
}

addIOEventHandlers({
    "connection": onConnect
});

addSocketEventHandlers({
    "disconnect": onDisconnect
});




// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
