var Host = require("./host.js");
var Player = require("./player.js");
module.exports = Game;

function Game(pin, host_socket) {
    this.pin = pin;
    this.host = new Host(host_socket, pin, this);
    // Can get the game using the host's ID
    this.players = [];
    // serializable players can be found in the
    // actual players themselves.
}

Game.prototype.addPlayer = function(socket, name) {
    this.players.push(new Player(socket, name, this));
}

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

