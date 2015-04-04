Daps = new Meteor.Collection("Daps");
Users = new Meteor.Collection("Users");
Template.new.events({
    "click .btnSend": function(event, template) {
        var dapID = getParameterByName("dapID");
        if (!dapID || dapID == "") {
            Meteor.call('api_newDap', "getting food", "fancy", function(error, result) {
                window.location.replace("/new?dapID=" + result);
            });
        } else {
            Meteor.call('api_sendDap', dapID, function(error, result) {});
            window.location.replace("/thanks");
        }
    },
    "click .btnPunch": function(event, template) {
        var phoneNumber = $("#inputPhone").val();
        console.log(phoneNumber);
        if (!phoneNumber || phoneNumber == "") {
            alert("Please enter the phone number.");
        } else {
            var dapID = getParameterByName("dapID");
            if (!dapID || dapID == "") {
                Meteor.call('api_newDap', "getting food", "fancy", function(error, result) {
                    window.location.replace("/new?dapID=" + result);
                });
            } else {
                Meteor.call('api_punch', phoneNumber, dapID, function(error, result) {});
            }
        }
    },
    "click .glyphicon-remove": function(event, template) {
        var dapID = getParameterByName("dapID");
        if (dapID) {
            console.log($(event.target).attr("userID"));
            Meteor.call('api_uninvite', $(event.target).attr("userID"), dapID, function(error, result) {});
        }
    },
    "keyup #inputPhone": function(event, template) {
        var phoneNumber = $(event.target).val();
        phoneNumber = phoneNumber.replace("-", "").replace(" ", "");
        $(event.target).val(phoneNumber);
    }
});
Template.new.helpers({
    groupMembers: function() {
        var dapID = getParameterByName("dapID");
        if (dapID) {
            try {
                return Daps.findOne({
                    _id: dapID
                }).users.map(function(userID) {
                    return Users.findOne({
                        _id: userID
                    });
                });
            } catch (ignore) {}

        }
    }
});

Meteor.autorun(function() {
    Meteor.subscribe("Users", function() {
        console.log("Loaded subscription");
    });
});


Template.new.rendered = function() {
    var dapID = getParameterByName("dapID");
    if (!dapID || dapID == "") {
        Meteor.call('api_newDap', "getting food", "fancy", function(error, result) {
            window.location.replace("/new?dapID=" + result);
        });
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}