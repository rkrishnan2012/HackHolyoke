Template.statusPage.helpers({
    commonPlace: function() {
        var dapID = getParameterByName("dapID");
        if (dapID) {
            try {
                return Daps.findOne({
                    _id: dapID
                }).commonPlace;
            } catch (ignore) {}

        }
    },
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


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}