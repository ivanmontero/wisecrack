/**
 * player.js represents a Player object, which is a client that will participate
 * in the game it is associated with.
 */

 /** Export the Player class */
module.exports = Player;

/**
 * Constructs a Player, with the provided properties.
 * 
 * @param {socket.io socket} socket The player's socket
 * @param {string} name The name of the player
 * @param {Game} game The game this player is associated with
 */
function Player(socket, name, game) {
    this.socket = socket;
    this.name = name;
    this.game = game;

    // LOAD HANDLERS HERE
}

/**
 * Releases resources, and detaches properties associated with this.
 */
Player.prototype.release = function() {
    // REMOVE HANDLERS HERE
}
