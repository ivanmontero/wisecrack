var socket;
$(document).ready(function() {
    socket = io();
    socket.on("setbodyhtml", function(data) {
        $("body").html(data);
    });
});
