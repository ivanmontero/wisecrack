var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var handlebars = require("handlebars");

var port = 8080;

app.use(express.static("static"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/select.html");
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});
