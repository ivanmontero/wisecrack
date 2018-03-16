/**
 * game.js represents a Game object. Each Game contains all the information
 * related to a single game instance, and handles the operation and state of
 * the contained game.
 */

/***** Module Imports *****/
var Host = require("./host.js");
var Player = require("./player.js");

/** Export the Game class */
module.exports = Game;

/**
 * Constructs a Game, with the provided properties.
 * 
 * @param {string} pin The pin of this game
 * @param {socket.io socket} host_socket The socket of the host
 */
function Game(pin, host_socket) {
    this.pin = pin;
    this.host = new Host(host_socket, pin, this);
    // Can get the game using the host's ID
    this.players = [];
    // serializable (ones able to be sent through sockets) players can be found
    // in the actual players themselves. TODO
}

/**
 * Appends a new player to this game.
 * 
 * @param {socket.io socket} socket The player's socket
 * @param {string} name The desred name of the player
 */
Game.prototype.addPlayer = function(socket, name) {
    this.players.push(new Player(socket, name, this));
}

/**
 * Releases resources, and detaches properties associated with this. Redirects 
 * all connected users to the select page.
 */
Game.prototype.release = function() {
    this.host.socket.leave(this.pin);
    this.host.release();
    this.host.socket.emit("setbodyhtml", getTemplate("select"));
    for(var i = this.players.length - 1; i >= 0; i--) {
        var player = this.players[i];
        player.socket.leave(this.pin);
        player.release();
        player.socket.emit("setbodyhtml", getTemplate("select"));
    }
    // release all players and hosts
    // redirect all users
    // remove listeners
}

