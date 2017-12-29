$(document).ready(function() {
    $(document).on("click", "#join-join-button", function() {
        var pin = $("#join-pin").val(), name = $("#join-name").val();
        console.log("joining " + pin + " with name " + name);
        socket.emit("join-join", pin, name);
    });

    $(document).on("input", ".join-ghost-input", function() {
        if($("#join-pin").val().length == 4 && $("#join-name").val()) {
            $("#join-join-button").css("display", "block");
        } else {
            $("#join-join-button").hide();
        }
    });

    $(document).on("click", "#join-back-button", function() {
        console.log("back to select");
        socket.emit("join-back");        
    });

    socket.on("join-join-error", function(error) {
        console.log(error);
        $("#join-error").text(error);
    });

});
