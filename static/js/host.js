$(document).ready(function() {
    $(document).on("click", "#host-back-button", function() {
        console.log("#host-back-button");
        socket.emit("host-back");
    });




});
