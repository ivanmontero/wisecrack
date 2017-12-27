// Module imports
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var handlebars = require("handlebars");
var fs = require("fs");

// Other file imports
// require('./filename.js')();
var Game = require("./game.js");

var port = 8080;
var socketEventHandlers;

app.use(express.static("static"));

app.get("/", function(req, res) {
    // var src = fs.readFileSync(__dirname + "/templates/select.html", "utf8");
    // var template = handlebars.compile(src);
    res.sendFile(__dirname + "/static/main.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});

function onConnect(socket) {
    console.log("user connected");
    // Socket handlers
    for(var e in socketEventHandlers) 
        socket.on(e, socketEventHandlers[e]);
    // Select screen
    var src = fs.readFileSync(__dirname + "/templates/select.html", "utf8");
    var template = handlebars.compile(src);
    socket.emit("setbodyhtml", template());
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
