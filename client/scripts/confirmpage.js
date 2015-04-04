Template.confirmPage.events({
    "change .descriptionSelect": function(event, template) {
        var desc = $(".descriptionSelect").val();
        var quality = $(".qualitySelect").val();
        var userID = getParameterByName("userID");
        if (userID && Session.get("browserLocation")) {
            var loc = Session.get("browserLocation");

            Meteor.call("api_changeVal", userID, desc, quality, function(error, result) {

            });
        } else {
            alert("Please refresh your browser. Your location couldn't be determined.");
        }
    },
    "change .qualitySelect": function(event, template) {
        var desc = $(".descriptionSelect").val();
        var quality = $(".qualitySelect").val();
        var userID = getParameterByName("userID");
        if (userID && Session.get("browserLocation")) {
            var loc = Session.get("browserLocation");

            Meteor.call("api_changeVal", userID, desc, quality, function(error, result) {

            });
        } else {
            alert("Please refresh your browser. Your location couldn't be determined.");
        }
    },
    "click .btnConfirm": function(event, template){
    	var userID = getParameterByName("userID");
    	var dapID = getParameterByName("dapID");
        if (dapID && userID && Session.get("browserLocation")) {
            var loc = Session.get("browserLocation");
            console.log(dapID);
            console.log(userID);
            console.log(loc);
            Meteor.call("api_confirm", dapID, userID, loc, function(error, result) {
            	window.location.replace("/status?dapID=" + dapID);
            });
        } else {
            alert("Please refresh your browser. Your location couldn't be determined.");
        }
    }
});

Template.confirmPage.rendered = function() {
    var userID = getParameterByName("userID");
    setTimeout(function() {
        var user = Users.findOne({
            _id: userID
        });
        console.log(user);
        $('.descriptionSelect option').eq(user.preference).prop('selected', true);
        $('.qualitySelect option').eq(user.quality).prop('selected', true);
    }, 500);
    getLocation();

};


function getLocation() {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

function locationSuccess(position) {
    loc = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    $(".btnStatus").text("Confirm Dap");
    Session.set("browserLocation", loc);
}

function locationError(error) {
    console.log('Error getting location: ' + error.code);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}