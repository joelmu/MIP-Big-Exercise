/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
    var getbtn = eLID("getbtn");
    getbtn.addEventListener("click", getLatLong);
    var locationbtn = eLID("locationbtn");
    locationbtn.addEventListener("click", locate);

  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);

    console.log('Received Event: ' + id);
  }

};

function eLID(id) {
  return document.getElementById(id);
}
var map,
  location,
  latitude,
  longitude,
  outputEL,
  currentText,
  searchText;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {
      lat: 60.2,
      lng: 25.5
    }
  });
}

function getLatLong() {
  var address = eLID("address-input").value;
  outputEL = eLID("lat-long-cont");
  var searchLocation = new google.maps.InfoWindow();

  $.getJSON({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: address,
      key: "AIzaSyAHUp32-b_Jv6cYCCiR1vJ5JovvzFyXVn8"
    },
    dataType: "json",
    success: function(response) {
      console.log(response);
      var location = response.results[0].geometry.location;
      console.log(location);
      var latitude = location.lat;
      var longitude = location.lng;
      var newCenter = {
        "lat": latitude,
        "lng": longitude
      }
      var searchText = "Latitude:  " + latitude + " and longitude: " + longitude + " of " + address;
      searchLocation.setPosition(newCenter);
      searchLocation.setContent(searchText)
      searchLocation.open(map);
      map.setCenter(newCenter);
      var marker = new google.maps.Marker({map: map, position: newCenter});

    },
    error: function(err) {
      outputEL.innerHTML = err;
    }
  });
}

function locate() {
  currentLocation = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var currentText = "Your current Latitude:  " + location.lat + " and longitude: " + location.lng;
      currentLocation.setPosition(location);
      currentLocation.setContent(currentText);
      currentLocation.open(map);
      map.setCenter(location);
      var marker = new google.maps.Marker({map: map, position: location});

    }, function(err) {
      console.log('Error:' + err)
      handleLocationError(true, currentLocation, map.getCenter());
    });
  } else {
    console.log('Nogeolocation object available');
    handleLocationError(false, currentLocation, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, currentLocation, location) {
  currentLocation.getPosition(location);
  currentLocation.setContent(
    browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.');
  currentLocation.open(map);
}

app.initialize();
