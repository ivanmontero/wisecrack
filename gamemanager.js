var fs = require("fs");
var handlebars = require("handlebars");

module.exports = function(io) {
    this.io = io;

    this.games = {}; // [id, game]
    
    this.addNewGame = function(host) {
        // Assign unique ID to this game
        var id = Math.floor(Math.random() * 10000);
        var unique = false;
        while(!unique) {
            unique = true;
            for(var uId in games) {
                if(parseInt(uId) == id) {
                    id = Math.floor(Math.random() * 10000);
                    unique = false;
                    break;
                }
            }
        }
        
        // Add leading zeroes
        sId = "" + id;
        while (sId.length < 4) {s = "0" + s;}
        
        // Add game
        games[sId] = new Game(sId, host);
        console.log("" + host.id + " created game with id " + sId); 
        
        // Set page for host     
        var src = fs.readFileSync(__dirname + "/templates/host.html", "utf8");
        var template = handlebars.compile(src);
        var data = {
            id: sId
        };
        host.emit("setbodyhtml", template(data));
    };

    this.Game = class {
        constructor(id, host) {
            this.roomID = id;
            this.host = host;
            this.host["game"] = this;
            this.players = [];

            // add host handler
            this.host.on("disconnect", function() {
                console.log("host of " + this.game.roomID + " has disconnected");
                this.game.release();
            });
        };

        release() {
            // TODO: Disconnect all the clients before deleting
            delete games[this.roomID];
        };
    };
}




// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
