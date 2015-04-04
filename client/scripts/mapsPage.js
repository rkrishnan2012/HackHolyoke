var myLat = 35.7748760;
var myLon = -78.9514510;

Template.mapsPage.rendered = function() {
    
    var map_style = [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#193341"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#29768a"
        }, {
            "lightness": -37
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#3e606f"
        }, {
            "weight": 2
        }, {
            "gamma": 0.84
        }]
    }, {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "weight": 0.6
        }, {
            "color": "#1a3541"
        }]
    }, {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }];
    var mapOptions = {
        center: {
            lat: 35.7748760,
            lng: -78.9514510
        },
        styles: map_style,
        zoom: 4
    };

    if (Session.get("browserLocation")) {
        myLat = Session.get("browserLocation").lat || myLat;
        myLon = Session.get("browserLocation").lon || myLon;
        mapOptions.center.lat = myLat;
        mapOptions.center.lon = myLon;
    }

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    console.log("Map is loaded!");
    getLocation();
};

Template.mapsPage.helpers({
    totalDaps: function() {
        return Daps.find({
            confirmedUsers : { $ne : null }
        }).fetch().length;
    }
});



function getLocation() {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

function locationSuccess(position) {
    loc = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    Session.set("browserLocation", loc);
    console.log(loc);

    var latlng = new google.maps.LatLng(loc.lat, loc.lon);
     new google.maps.Marker({
        position: latlng,
        map: map
     });
}

function locationError(error) {
    console.log('Error getting location: ' + error.code);
}