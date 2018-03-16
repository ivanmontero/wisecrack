/**
 * main.js is the main entry point of the wisecrack. Sets up the server-side
 * handling of connections and adds listeners so the user can host a new game 
 * or join an existing one.
 */

/***** Module Imports *****/
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

/***** File imports *****/
require("./templatemanager.js")();
var GameManager = require("./gamemanager.js");

/** Port, determined by OPENSHIFT or default 8080 */
var port = process.env.PORT 
        || process.env.OPENSHIFT_NODEJS_PORT 
        || 8080;

// Set the program to serve static files from the "static" directory
app.use(express.static("static"));

// Serve the homepage on a new connection. "main.html" is the skeleton that
// holds all other webpages, since this program runs in a single page.
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/main.html");
});

// Set up the HTTP server to listen on the port.
http.listen(port, function() {
    console.log("listening on *:" + port);
});

// Called when a new user connects. Serves the "select" page and prepares the
// socket to handle the user's selection. 
io.on("connection", function(socket) {
    console.log("user connected");

    addDefaultListeners(socket);

    socket.emit("setbodyhtml", getTemplate("select"));
});

/**
 * Adds all the listeners which a new connection needs, including ones for the
 * select and join page.
 * 
 * @param {socket.io socket} socket The socket assocated with the new 
 *        connection.
 */
function addDefaultListeners(socket) {
    // Default disconnect listener
    socket.on("disconnect", function() {
        console.log("user diconnected");
    });
    // For when the user clicks the "host" button
    socket.on("select-host", function() {
        GameManager.addNewGame(this);
    });
    // For when the user clicks the "join" button
    socket.on("select-join", function() {
        // Set page for user
        this.emit("setbodyhtml", getTemplate("join"));
    });
    // When the user selects the "back" button on the join screen
    socket.on("join-back", function() {     
        socket.emit("setbodyhtml", getTemplate("select"));
    });
    // When the user selects the "join" button on the join screen
    socket.on("join-join", function(pin, name) {
        if(!GameManager.joinGame(pin, this, name)) {
            // Case where user provides an invalid pin
            socket.emit("join-join-error", 
                        "game with pin " + pin + " does not exist");
        } else {
            // Case where user provides a valid pin
            var data = {
                name: name
            };
            socket.emit("setbodyhtml", getTemplate("player", data));
        }
    });
}
