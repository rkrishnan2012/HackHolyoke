var BASE_URL = "http://192.168.42.2:3000"
Meteor.methods({
    api_newDap: function(description, quality) {
        var fut = new Future();
        Daps.insert({
            users: [],
            preference: description,
            quality: quality
        }, function(err, dapID) {
            fut['return'](dapID);
        });
        return fut.wait();
    },
    api_punch: function(phoneNumber, dapID) {
        var fut = new Future();
        var dap = Daps.findOne({
            _id: dapID
        });
        if (dap != null) {
            var addUserToDap = function(user) {
                console.log("Inviting " + user.phoneNumber);
                Daps.update({
                    _id: dapID
                }, {
                    $push: {
                        users: user._id
                    }
                });
                fut['return'](dapID);
            };
            var existingUser = Users.findOne({
                phoneNumber: phoneNumber
            });
            if (!existingUser) {
                console.log("Creating a new user");
                Users.insert({
                    phoneNumber: phoneNumber,
                    preference: 1,
                    quality: 1
                }, function(err, userID) {
                    addUserToDap(Users.findOne({
                        phoneNumber: phoneNumber
                    }));
                });
            } else {
                addUserToDap(existingUser);
            }
        } else {
            console.log("Dap doesn't exist!");
        }
        return fut.wait();
    },
    api_uninvite: function(userID, dapID) {
        Daps.update({
            _id: dapID
        }, {
            $pull: {
                users: userID
            }
        });
    },
    api_sendDap: function(dapID) {
        var dap = Daps.findOne({
            _id: dapID
        });
        if (dap != null) {
            for (userID in dap.users) {
                var user = Users.findOne({
                    _id: dap.users[userID]
                });
                var longUrl = encodeURIComponent(BASE_URL + "/confirm?dapID=" + dap._id + "&userID=" + user._id);
                getShortUrl(longUrl, function(error, url) {
                    sendSMSMessage(user, "You got a Dap. " + url);
                });
            }
        } else {
            console.log("Dap doesn't exist!");
        }
    },
    api_changeVal: function(userID, preference, quality) {
        console.log("Changing " + userID + " to " + preference + " and " + quality);
        Users.update({
            _id: userID
        }, {
            preference: preference,
            quality: quality
        });
    },
    api_confirm: function(dapID, userID, loc) {
        //console.log("Confirming " + userID + " into " + dapID + " @ " + loc);
        var dap = Daps.findOne({
            _id: dapID
        });
        if (dap != null) {
            var confirmedUsers = dap.confirmedUsers || [];
            var hasUser = false;
            for (pair in confirmedUsers) {
                if (pair._id == userID) {
                    hasUser = true;
                    pair.loc = loc;
                }
            }
            if (!hasUser) {
                confirmedUsers.push({
                    _id: userID,
                    loc: loc
                });
            }
            Daps.update({
                _id: dapID
            }, {
                $set: {
                    confirmedUsers: confirmedUsers
                }

            }, function(){
                calculateLocation(confirmedUsers, dap);
            });
        }
    },
});

function calculateLocation(confirmedUsers, dap) {
    var lastCalculation = dap.lastCalculation || 0;
    if (1 /*Date.now() - lastCalculation > 1000 * 20*/ ) {
        var sum = {};
        var count = 1;
        var latLonList = confirmedUsers.map(function(confirmedUser) {
            return confirmedUser.loc
        }).reduce(function(previousValue, currentValue, index, array) {
            count++;
            sum = {
                lat: previousValue.lat + currentValue.lat,
                lon: previousValue.lon + currentValue.lon
            };
            return sum;
        });

        sum = {
            lat: (sum.lat / count) || 42.3606909,
            lon: (sum.lon / count) || -71.0794784
        };



        // http://api.tripadvisor.com/api/partner/2.0/map/42.33141,-71.099396/attractions?key=HackTripAdvisor-ade29ff43aed
        getRequest("http://api.tripadvisor.com", 80, "/api/partner/2.0/map/" + encodeURIComponent(sum.lat + "," + sum.lon) + "/attractions?key=HackTripAdvisor-ade29ff43aed",
            function(error, result) {
                console.log(result.data.data[0].name);
                Daps.update({
                    _id: dap._id
                }, {
                    $set: {
                        lastCalculation: Date.now(),
                        commonPlace: result.data.data[0].name,
                        commonAddress: result.data.data[0].address_obj,
                        commonId: result.data.data[0].location_id
                    }

                });
            });

        notifyEveryone(dap);
    } else {
        console.log("Deferring re-calculation because of time");
    }
}

function notifyEveryone(dap) {
    if (dap != null) {
        var longUrl = encodeURIComponent(BASE_URL + "/status?dapID=" + dap._id);
        getShortUrl(longUrl, function(error, url) {
            for (userID in dap.users) {
                var user = Users.findOne({
                    _id: dap.users[userID]
                });
                sendSMSMessage(user, "Venue has changed!" + url);
            }
        });
    } else {
        console.log("Dap doesn't exist!");
    }
}

function getShortUrl(longUrl, next) {
    //GET /v3/shorten?access_token=ACCESS_TOKEN&longUrl=http%3A%2F%2Fgoogle.com%2F
    var ACCESS_TOKEN = "7865082b5e1c473d3012de26d0f7ece94b492c54";
    getRequest("https://api-ssl.bitly.com", 443, "/v3/shorten?access_token=" +
        ACCESS_TOKEN + "&longUrl=" + longUrl, function(error, result) {
            if (next) {
                next(error, result.data.data.url);
            }
        });
}

function sendSMSMessage(user, body) {
    // Twilio Credentials
    var accountSid = 'AC2030dd3c11b18dbc87137f961d2f98fa';
    var authToken = '77a699bbfbd4c4952505a7eca5dec4c9';
    twilio = Twilio(accountSid, authToken);
    twilio.sendSms({
        to: user.phoneNumber,
        from: "+13392300519",
        body: body
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1
            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."
        }
    });
}



Meteor.startup(function() {
    Future = Npm.require('fibers/future');
});