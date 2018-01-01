/***** IMPORTS *****/
// Module imports
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// File imports
var templates = require("./templatemanager.js")();
require("./gamemanager.js")(io);
/***** IMPORTS *****/

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static("static"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/main.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});

io.on("connection", function(socket) {
    console.log("user connected");
    // Socket handlers
    socket.on("disconnect", function() {
        console.log("user diconnected");
    });
    socket.on("select-host", function() {
        addNewGame(this);
    });
    socket.on("select-join", function() {
        // Set page for user
        this.emit("setbodyhtml", templates["join"]());
    });
    socket.on("join-back", function() {     
        socket.emit("setbodyhtml", templates["select"]());
    });
    socket.on("join-join", function(pin, name) {
        if(!joinGame(pin, this, name)) {
            socket.emit("join-join-error", "game with pin " + pin + " does not exist");
        } else {
            var data = {
                name: name
            };
            socket.emit("setbodyhtml", templates["player"](name));
        }
    });

    // Select screen
    socket.emit("setbodyhtml", templates["select"]());
});

// // Add all handlers here
// for (let [e, handler] of Object.entries({
//     "connection": onConnect
// })) io.on(e, handler);

