/**
 * gamemanager.js stores and manages all the current running games. It has the
 * ability to create new games, append new users to current games, and remove
 * games.
 */

 /***** File Imports *****/
require("./templatemanager.js")();
var Game = require("./game.js")

/** The single of this (singleton) */
var instance = new GameManager();

/** Export the one instance of this */
module.exports = instance;

/** The constructor for this */
function GameManager() {
    this.games = {};
}

/**
 * Creates a new game, hosted by the provided socket. Provides a unique pin to
 * the game, and sets up the host's webpage.
 * 
 * @param {socket.io socket} host The socket that will be hosting the game.
 */
GameManager.prototype.addNewGame = function(host) {
    // Produces a unique pin for the new game
    var pin = Math.floor(Math.random() * 10000);
    var unique = false;
    while(!unique) {
        unique = true;
        for(var uPin in this.games) {
            if(parseInt(uPin) == pin) {
                pin = Math.floor(Math.random() * 10000);
                unique = false;
                break;
            }
        }
    }

    // Add leading zeroes
    var sPin = "" + pin;
    while (sPin.length < 4) {sPin = "0" + sPin;}

    // Add game
    this.games[sPin] = new Game(sPin, host);
    console.log("" + host.id + " created game with pin " + sPin); 

    // Set host room
    host.join(sPin + "host");

    // Set page for host     
    var data = {
        game_pin: sPin
    };
    host.emit("setbodyhtml", getTemplate("host", data));
}

/**
 * Attempts to append a user to a currently running game.
 * 
 * @param {string} pin The pin of the desired game to join
 * @param {socket.io socket} socket The socket of the joining user
 * @param {string} name The desired name of the joining user
 * @return true if and only if a game with the given pin exists, and the join
 *         was successful
 */
GameManager.prototype.joinGame = function(pin, socket, name) {
    if(!this.games.hasOwnProperty(pin)) return false;
    this.games[pin].addPlayer(socket, name);
    socket.join(pin);
    return true;
}

/**
 * Removes the game with the specified pin from this, if it exists.
 * 
 * @param {string} pin The pin of the desired game to remove
 */
GameManager.prototype.removeGame = function(pin) {
    if(this.games.hasOwnProperty(pin)) {
        this.games[pin].release();
        delete this.games[pin];
    }
}

// // functions using this must be declared async. to call this, you
// // must precede the function call with "await".
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
