// Author :  Craig Treulieb - 0606138
// Date: 26/03/2014
// File: default.js - contains the javascripting for Mapping2 web application

// global variables for map, pins, and infoboxes
var map;
var theatreInfoBox;
var restaurantInfoBox;
var homePin;
var theatrePin;
var restaurantPin;
var mapCenter;


// boot
// Called on page load. Loads the map.
function boot() {
    Microsoft.Maps.loadModule('Microsoft.Maps.Overlays.Style', { callback: getMap });
}

// getMap
// Called by boot. Loads the map, sets the geolocation and calls resizeWin to ensure map is proper size for the window.
// As well initializes the infoboxes
function getMap() {
    map = new Microsoft.Maps.Map($gel("bingMap"), {
        credentials: "AqBkuv - Zl3VBhlSTBQggN78po_dz1plmzYznwJyMiUrAiONuxIXGBQWiQfVrU1lt",
        customizeOverlays: true,
        enableClickableLogo: false,
        enableSearchLogo: false,
        showDashboard: false,
        showBreadcrumb: false,
        showCopyright: true,
        zoom: 10,
        labelOverlay: Microsoft.Maps.LabelOverlay.hidden
    });
    setGeoLocation();
    theatreInfoBox = new Microsoft.Maps.Infobox(map.getCenter(),
                {
                    visible: false,
                    zIndex: 10
                });
    restaurantInfoBox = new Microsoft.Maps.Infobox(map.getCenter(),
                {
                    visible: false,
                    zIndex: 10
                });
    Microsoft.Maps.Events.addHandler(theatreInfoBox, 'click', selectTheatre);
    Microsoft.Maps.Events.addHandler(restaurantInfoBox, 'click', selectRestaurant);
    map.entities.push(theatreInfoBox);
    map.entities.push(restaurantInfoBox);
     //sets window resize event handler
    window.onresize = resizeWin;
    resizeWin();
}

// setGeoLocation
// either sets the geolocation to the current location of device calling it, or to centre of North America
function setGeoLocation() {
    // Check for geolocation support
    if (navigator.geolocation) {
        // Use method getCurrentPosition to get coordinates
        navigator.geolocation.getCurrentPosition(function (position) {
            // Access them accordingly
            mapCenter = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
            map.setView({ zoom: 15, center: mapCenter });
        });
    }
    else {
        // set to centre of North America
        map.setView({ zoom: 4, center: new Microsoft.Maps.Location(47.23591995239258, -93.52752685546875) });
    }
}

// support function wraps the document.getElementById
// property to reduce the code size
function $gel(docElem) {
    return document.getElementById(docElem);
}

// resizeWin
// resizes the map container when the browser resizes
function resizeWin() {
    var bingHeight;
    if (window.innerWidth >= 1025) //determine if mobile or desktop layout
        bingHeight = window.innerHeight * 0.85;
    else
        bingHeight = (window.innerHeight - ($gel("myForm").offsetHeight + $gel("title").offsetHeight)) * 0.85;
    $gel("bingMap").style.height = bingHeight + "px";
    return;
}

// clearMap
// removes anything that isn't an infobox from the map (pins and routes)
function clearMap() {
    for (var i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (!(pushpin instanceof Microsoft.Maps.Infobox))
            map.entities.removeAt(i);
    }
}


// displayTheatreInfo
// Function caled to display information in an infobox about the theatre currently clicked
// Also loads the currently selected pin into the theatre pin global variable in case that theatre is selected
function displayTheatreInfo(e) {
    restaurantInfoBox.setOptions({ visible: false });
    theatreInfoBox.setLocation(new Microsoft.Maps.Location(e.target._location.latitude, e.target._location.longitude));
    var description = e.target.address + "</br>" + e.target.locality + ", " + e.target.region + "</br>" + e.target.tel + "</br> Click to view nearby restuarants </br>";
    theatreInfoBox.setOptions({ title: e.target.title, description: description, visible: true });
    theatrePin = e.target;
    var buffer = 25;
    var tOffset = theatreInfoBox.getOffset();
    var tAnchor = theatreInfoBox.getAnchor();
    var tLocation = map.tryLocationToPixel(e.target.getLocation(), Microsoft.Maps.PixelReference.control);

    var dx = tLocation.x + tOffset.x - tAnchor.x;
    var dy = tLocation.y - 25 - tAnchor.y;
    if (dy < buffer) { //overlaps with top of map
        dy *= -1;
        dy += buffer;
    }
    else {
        dy = 0; //no overlap
    }

    if (dx < buffer) { //overlaps with left side of map
        dx *= -1;
        dx += buffer;
    }
    else {
        dx = map.getWidth() - tLocation.x + tAnchor.x - theatreInfoBox.getWidth();
        if (dx > buffer) {
            dx = 0; //does not overlap on right
        }
        else {
            dx -= buffer; //overlap on right side
        }
    }
    if (dx != 0 || dy != 0) {
        map.setView({ centerOffset: new Microsoft.Maps.Point(dx, dy), center: map.getCenter() });
    }
}


// displayRestaurantInfo
// Function caled to display information in an infobox about the restaurant currently clicked
// Also loads the currently selected pin into the restaurant pin global variable in case that restaurant is selected
function displayRestaurantInfo(e) {
    theatreInfoBox.setOptions({ visible: false });
    restaurantInfoBox.setLocation(new Microsoft.Maps.Location(e.target._location.latitude, e.target._location.longitude));
    var description = e.target.address + "</br>" + e.target.locality + ", " + e.target.region + "</br>" + e.target.tel + "</br> Click to select this restaurant </br>";
    restaurantInfoBox.setOptions({ title: e.target.title, description: description, visible: true });
    restaurantPin = e.target;
    var buffer = 25;
    var rOffset = restaurantInfoBox.getOffset();
    var rAnchor = restaurantInfoBox.getAnchor();
    var rLocation = map.tryLocationToPixel(e.target.getLocation(), Microsoft.Maps.PixelReference.control);

    var dx = rLocation.x + rOffset.x - rAnchor.x;
    var dy = rLocation.y - 25 - rAnchor.y;
    if (dy < buffer) { //overlaps with top of map
        dy *= -1;
        dy += buffer;
    }
    else {
        dy = 0; //no overlap
    }

    if (dx < buffer) { //overlaps with left side of map
        dx *= -1;
        dx += buffer;
    }
    else {
        dx = map.getWidth() - rLocation.x + rAnchor.x - restaurantInfoBox.getWidth();
        if (dx > buffer) {
            dx = 0; //does not overlap on right
        }
        else {
            dx -= buffer; //overlap on right side
        }
    }
    if (dx != 0 || dy != 0) {
        map.setView({ centerOffset: new Microsoft.Maps.Point(dx, dy), center: map.getCenter() });
    }
}

// selectTheatre
// selects the theatre and gets close by restaurants while getting rid of the other theatres it had previously found
function selectTheatre(e) {
    //clear map
    clearMap();
    //re-add theatre and home pin to the map
    map.entities.push(homePin);
    map.entities.push(theatrePin);
    //get close by restaurants
    getRestaurants();
    // hide the theatre infobox
    theatreInfoBox.setOptions({ visible: false });
}

// selectRestaurant
// selects the restaurant and gets directions and hides the other restaurants it had found.
function selectRestaurant(e) {
    clearMap();
    //re-add theatre, home and restaurant pins
    map.entities.push(homePin);
    map.entities.push(theatrePin);
    map.entities.push(restaurantPin);
    //hide the restaurant infobox
    restaurantInfoBox.setOptions({ visible: false });
    //set the map view to see the theatre, restaurant, and home locations
    var finalLocArray = [];
    finalLocArray.push(homePin._location);
    finalLocArray.push(theatrePin._location);
    finalLocArray.push(restaurantPin._location);
    map.setView({ bounds: new Microsoft.Maps.LocationRect.fromLocations(finalLocArray) });
    // get directions from home to dinner, to the theatre, and back to home
    getDirections();
}

// clickFindTheatres
// ensures something was entered into the address box and then attempts to geocode that location and find nearby theatres
function clickFindTheatres(credentials) {
    if (!$gel('tAddress').value.match(/\S/)) {
        alert('Please enter an address, or perhaps search using the current map location');
    }
    else {
        //clears the map at the start of a new search
        clearMap();
        theatreInfoBox.setOptions({ visible: false });
        restaurantInfoBox.setOptions({ visible: false });
        map.getCredentials(makeGeocodeRequest);
    }
}

// searchCurrentlocation
// searched for nearby theatres from the centre of the map
function searchCurrentLocation() {
    clearMap();
    theatreInfoBox.setOptions({ visible: false });
    restaurantInfoBox.setOptions({ visible: false });
    homePin = new Microsoft.Maps.Pushpin(mapCenter, {
        icon: "images/house.png",
        draggable: false,
        width: 30,
        height: 30,
    });
    map.entities.push(homePin);
    getTheatres(homePin._location.latitude, homePin._location.longitude);
}

// makeGeocodeRequest
// Makes a REST request for the geocode services and then passes it on to be called
function makeGeocodeRequest(credentials) {
    var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?query=" + encodeURI($gel('tAddress').value) + "&output=json&jsonp=geocodeCallback&key=" + credentials;

    callRestService(geocodeRequest);
}

// callRestService
// calles REST service with a request
function callRestService(request) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", request);
    document.body.appendChild(script);
}

// geocodeCallback
// if geocoding succeeded it will then search for theatres with the result of the geocode
function geocodeCallback(result) {
    homePin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[0], result.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]), {
        icon: "images/house.png",
        draggable: false,
        width: 30,
        height: 30,
    });
    map.entities.push(homePin);
    getTheatres(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[0], result.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]);
}

// getTheatres
// makes actual ajax call to get the theatres near by
function getTheatres(latIn, longIn) {
    $.ajax({
        url: "dinnerandmovie.aspx/getFactualTheatres",
        data: JSON.stringify({ latitude: latIn, longitude: longIn, range: $gel("sRange").value }),
        type: "POST",
        contentType: "application/json",
        dataType: "JSON",
        timeout: 600000,
        success: function (result) {
            placePins(result, false);
        },
        error: function (xhr, status) {
            alert(status + " - " + xhr.responseText);
        }
    });
}


// getRestaurants
// makes actual ajax call to get the restaurants near by
function getRestaurants() {
    $.ajax({
        url: "dinnerandmovie.aspx/getFactualRestaurants",
        data: JSON.stringify({ latitude: theatrePin._location.latitude, longitude: theatrePin._location.longitude }),
        type: "POST",
        contentType: "application/json",
        dataType: "JSON",
        timeout: 600000,
        success: function (result) {
            placePins(result, true);
        },
        error: function (xhr, status) {
            alert(status + " - " + xhr.responseText);
        }
    });
}

// getDirections
// calls makeRouteRequest with credentials
function getDirections() {
    map.getCredentials(makeRouteRequest);
}
// makeRouteRequest
// makes REST request to get a route between home, dinner, theatre, and back home again
function makeRouteRequest(credentials) {
    var routeRequest = "http://ecn.dev.virtualearth.net/REST/v1/Routes?wp.0=" + homePin._location.latitude + "," + homePin._location.longitude + "&wp.1=" + restaurantPin._location.latitude + "," + restaurantPin._location.longitude + "&wp.2=" + theatrePin._location.latitude + "," + theatrePin._location.longitude + "&wp.3=" + homePin._location.latitude + "," + homePin._location.longitude + "&routePathOutput=Points&output=json&jsonp=routeCallback&key=" + credentials;
    callRestService(routeRequest);
}

// routeCallback
// draws the route object onto the map
function routeCallback(result) {
    //verify the result is valid
    if (result &&
       result.resourceSets &&
       result.resourceSets.length > 0 &&
       result.resourceSets[0].resources &&
       result.resourceSets[0].resources.length > 0) {


        // Draw the route
        var routeline = result.resourceSets[0].resources[0].routePath.line;
        var routepoints = [];
        for (var i = 0; i < routeline.coordinates.length; i++) {
            routepoints[i] = new Microsoft.Maps.Location(routeline.coordinates[i][0], routeline.coordinates[i][1]);
        }

        // Draw the route on the map
        var options = {
            strokeColor: new Microsoft.Maps.Color(187, 255, 0, 0),
            strokeThickness: 5
        };
        var routeshape = new Microsoft.Maps.Polyline(routepoints, options);
        map.entities.push(routeshape);

    }
}

// placePins
// places either restaurant pins or theatre pins on the map based on a passed in boolean value
function placePins(factualString, isRestaurants) {
    var factualPins = JSON.parse(factualString.d);
    var locArray = [];
    // set pin image
    if (isRestaurants)
        var pinImg = "images/restaurant.png";
    else
        var pinImg = "images/film.png";
    if (factualPins.response.included_rows !== 0) {
        factualPins.response.data.forEach(function (locale) {
            // create Location object from the locale object
            var latLong = new Microsoft.Maps.Location(locale.latitude, locale.longitude);
            var pin = new Microsoft.Maps.Pushpin(latLong, {
                icon: pinImg,
                anchor: new Microsoft.Maps.Point(8, 8),
                draggable: false,
                width: 40,
                height: 40,
            });
            // add location object to location array
            locArray.push(latLong);
            pin.title = locale.name;
            pin.address = locale.address;
            pin.tel = locale.tel;
            pin.region = locale.region;
            pin.locality = locale.locality;
            // set click event handler for the pin
            if (isRestaurants)
                pushpinClick = Microsoft.Maps.Events.addHandler(pin, 'click', displayRestaurantInfo);
            else
                pushpinClick = Microsoft.Maps.Events.addHandler(pin, 'click', displayTheatreInfo);
            map.entities.push(pin);
        });
        // set view based on location array
        map.setView({ bounds: new Microsoft.Maps.LocationRect.fromLocations(locArray) });
    }
    else
        alert("No locations found");

}