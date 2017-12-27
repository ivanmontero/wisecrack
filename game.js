module.exports = class {
    constructor(id, host) {
        this.roomID = id;
        this.host = host;
        this.players = [];
    }


};




// functions using this must be declared async. to call this, you
// must precede the function call with "await".
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
