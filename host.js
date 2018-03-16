module.exports = Host;

function Host(socket, pin, game) {
    this.socket = socket;
    this.socket.container = this;
    this.pin = pin;
    this.game = game;

    var GameManager = require("./gamemanager.js");

    // Load handlers
    socket.on("disconnect", function() {
        console.log("host of " + this.container.pin + " has disconnected");
        GameManager.removeGame(this.container.pin);
    });
    socket.on("host-back", function() {
        console.log("host of " + this.container.pin + " has left");
        GameManager.removeGame(this.container.pin);
    });
}

Host.prototype.release = function() {
    this.socket.removeAllListeners("host-back");
    this.socket.removeAllListeners("disconnect");
    this.socket.on("disconnect", function() {
        console.log("user disconnected");
    });
}

// DON'T FORGET TO REMOVE LISTENERS