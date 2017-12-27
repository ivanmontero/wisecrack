module.exports = function(io) {
    this.io = io;

    this.games = {}; // [id, game]
    
    this.addNewGame = function(host) {
        // Lets make the ID a unique combination of numbers
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
        games[sId] = new Game(sId, host);
    };

    this.Game = class {
        constructor(id, host) {
            this.roomID = id;
            this.host = host;
            this.players = [];
        }
    };
}




// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
