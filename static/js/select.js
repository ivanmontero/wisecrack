$(document).ready(function() {
    $(document).on("click", "#select-button-host", function() {
        console.log("#select-button-host");
        socket.emit("select-host");
    });

    $(document).on("click", "#select-button-join", function() {
        console.log("#select-button-join");
        socket.emit("select-join");
    });
});
