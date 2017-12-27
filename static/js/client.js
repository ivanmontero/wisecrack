$(document).ready(function() {
    var socket = io();
    socket.on("setbodyhtml", function(data) {
        $("body").html(data);
    });
});
