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

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static("static"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/main.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});

function onConnect(socket) {
    console.log("user connected");
    // Socket handlers
    socket.on("disconnect", function() {
        console.log("user diconnected");
    });

    // Select screen
    var src = fs.readFileSync(__dirname + "/templates/select.html", "utf8");
    var template = handlebars.compile(src);
    socket.emit("setbodyhtml", template());
}

function onDisconnect() {
    console.log("user disconnected");
}

// Add all handlers here
for (let [e, handler] of Object.entries({
    "connection": onConnect
})) io.on(e, handler);

