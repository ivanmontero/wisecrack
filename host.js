/**
 * host.js represents a Host object, which is a client that display all the 
 * information which the players will see. It is also the one client that the
 * game will be associated with.
 */

/** Export the Host class */
module.exports = Host;

/**
 * Constructs a Host, with the provided properties.
 * 
 * @param {socket.io socket} socket The player's socket
 * @param {string} pin The pin of the associated game
 * @param {Game} game The game this host is associated with
 */
function Host(socket, pin, game) {
    this.socket = socket;
    this.socket.container = this;
    this.pin = pin;
    this.game = game;

    loadHostListeners(socket);
}

/**
 * Releases resources, and detaches properties associated with this.
 */
Host.prototype.release = function() {
    this.socket.removeAllListeners("host-back");
    this.socket.removeAllListeners("disconnect");
    this.socket.on("disconnect", function() {
        console.log("user disconnected");
    });
}

/**
 * Adds all the listeners assocated with a host object.
 * 
 * @param {socket.io socket} socket The socket assocated with the host
 */
function loadHostListeners(socket) {
    var GameManager = require("./gamemanager.js");

    socket.on("disconnect", function() {
        console.log("host of " + this.container.pin + " has disconnected");
        GameManager.removeGame(this.container.pin);
    });
    socket.on("host-back", function() {
        console.log("host of " + this.container.pin + " has left");
        GameManager.removeGame(this.container.pin);
    });
}