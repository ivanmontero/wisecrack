var fs = require("fs");
var handlebars = require("handlebars");

module.exports = function(io) {
    this.io = io;

    this.games = {}; // [pin, game]
    
    this.addNewGame = function(host) {
        // Assign unique PIN to this game
        var pin = Math.floor(Math.random() * 10000);
        var unique = false;
        while(!unique) {
            unique = true;
            for(var uPin in games) {
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
        games[sPin] = new Game(sPin, host);
        console.log("" + host.id + " created game with pin " + sPin); 
        
        // Set page for host     
        var src = fs.readFileSync(__dirname + "/templates/host.html", "utf8");
        var template = handlebars.compile(src);
        var data = {
            game_pin: sPin
        };
        host.emit("setbodyhtml", template(data));
    };
    
    // returns true if successful join
    this.joinGame = function(pin, socket, name) {
        if(!games.hasOwnProperty(pin)) return false;
        games[pin].addPlayer(socket, name);
        return true;
    };

    this.Game = class {
        constructor(pin, host) {
            this.pin = pin;
            this.host = host;
            this.host["game"] = this;
            this.players = [];
            this.serializablePlayers = [];

            // add host handler
            this.host.on("disconnect", function() {
                console.log("host of " + this.game.pin + " has disconnected");
                this.game.release();
            });
        };

        addPlayer(socket, name) {
            this.players.push(socket, name, this);
            this.serializablePlayers.push ({
                id: socket.id,
                name: name,
                // ...
            });
            // alert host
            // TODO: Change name to make applicable
            this.host.emit("updateplayers", serializablePlayers);
        };

        release() {
            // TODO: Disconnect all the clients before deleting
            delete games[this.pin];
        };
    };

    this.Player = class {
        constructor(socket, name, game) {
            this.socket = socket;
            this.name = name;
            this.game = game;
            this.points = 0;
        }

        // ...
    };
}




// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
