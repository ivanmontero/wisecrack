module.exports = Player;

function Player(socket, name, game) {
    this.socket = socket;
    this.name = name;
    this.game = game;

    // LOAD HANDLERS HERE
}

Player.prototype.release = function() {
    // REMOVE HANDLERS HERE
}
