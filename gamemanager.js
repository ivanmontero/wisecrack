require("./templatemanager.js")();
var Game = require("./game.js")

var instance = new GameManager();

module.exports = instance;

function GameManager() {
    this.games = {};
}

GameManager.prototype.addNewGame = function(host) {
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

GameManager.prototype.joinGame = function(pin, socket, name) {
    if(!this.games.hasOwnProperty(pin)) return false;
    this.games[pin].addPlayer(socket, name);
    socket.join(pin);
    return true;
}

GameManager.prototype.removeGame = function(pin) {
    this.games[pin].release();
    delete this.games[pin];
}

// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
