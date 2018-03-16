/**
 * main.js is the main entry point of the wisecrack. Sets up the server-side
 * handling of connections and allows them to either create a game or join an
 * existing one.
 */

// Module imports
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// File imports
require("./templatemanager.js")();
var GameManager = require("./gamemanager.js");

// Port, determined by OPENSHIFT or default 8080
var port = process.env.PORT 
        || process.env.OPENSHIFT_NODEJS_PORT 
        || 8080;

// Set the program to serve static files from the "static" directory
app.use(express.static("static"));

// Serve the homepage on a new connection
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/main.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});

io.on("connection", function(socket) {
    console.log("user connected");

    addDefaultListeners(socket);

    // Select screen
    socket.emit("setbodyhtml", getTemplate("select"));
});

function addDefaultListeners(socket) {
    socket.on("disconnect", function() {
        console.log("user diconnected");
    });
    socket.on("select-host", function() {
        GameManager.addNewGame(this);
    });
    socket.on("select-join", function() {
        // Set page for user
        this.emit("setbodyhtml", getTemplate("join"));
    });
    socket.on("join-back", function() {     
        socket.emit("setbodyhtml", getTemplate("select"));
    });
    socket.on("join-join", function(pin, name) {
        if(!GameManager.joinGame(pin, this, name)) {
            socket.emit("join-join-error", 
                        "game with pin " + pin + " does not exist");
        } else {
            var data = {
                name: name
            };
            socket.emit("setbodyhtml", getTemplate("player", data));
        }
    });
}
