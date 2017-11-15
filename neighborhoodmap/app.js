//Locations for the map
var locations = [
  {
    name: 'Santa Cruz Beach Boardwalk',
    location: {
      lat: 36.964234,
      long: -122.018831,
    }
  },
  {
    name: 'The Wharf',
    location: {
      lat: 36.957273,
      long: -122.028315,
    }
  },
  {
    name: 'Lighthouse Field Surfing Museum',
    location: {
      lat: 36.951374,
      long: -122.028315,
    }
  },
  {
    name: 'Natural Bridges',
    location: {
      lat: 36.952883,
      long: -122.056806,
    }
  },
  {
    name: 'Monterey Bay National Marine Sanctuary Exploration Center',
    location: {
      lat: 36.963239,
      long: -122.024619,
    }
  }
];

//Declare Global Variables
var map;
var Location;
var clientID;
var clientSecret;

//Constructor
Location = function(data) {
  var self = this;

  this.name = data.name;
  this.lat = data.lat;
  this.long = data.long;
  this.URL = '';
  this.street = '';
  this.city = '';
  this.phone = '';

  this.visible = ko.observable(true);

  //API credits for Foursquare
  clientID = '3GLSBCS5G5SCSNMX5QXNEWGW2P4FBUDE0QGRD255VVL1M2VR';
  clientSecret = 'IL50X5OBDQ0JFUBOGOOL0UXI4DJY4TPVNMX1G4CI1MBTWUUX';

  //Make JSON request to Foursquare api
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170413' + '&query=' + this.name;
  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.URL = results.URL;
    if (typeof self.URL === 'undefined') {
      self.URL = "";
    }
    self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
    self.phone = results.contact.phone;
  }).fail(function() {
    $('.list').html('Something went wrong with Foursquare :/');
  });

  //Infowindow information
  this.contentString = '<div class="info-window-content"><div class="title"><strong>' + data.name + "</strong></div>" +
    '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
    '<div class="content">' + self.street + "</div>" +
    '<div class="content">' + self.city + "</div>" +
    '<div class="content">' + self.phone + "</div></div>";

  this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

  //Sets a location from list to its marker
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.long),
    map: map,
    title: data.name
  });

  //Makes sure that only one marker is opened at a time
  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  this.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
      '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
      '<div class="content">' + self.street + "</div>" +
      '<div class="content">' + self.city + "</div>" +
      '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

    self.infoWindow.setContent(self.contentString);

    self.infoWindow.open(map, this);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 1400);
  });

  this.bounce = function(place) {
    google.maps.event.trigger(self.marker, 'click');
  };
};

//Start the ViewModel
function ViewModel(){
  var self = this;
  this.toggleSymbol = ko.observable('hide');

  this.searchTerm = ko.observable('');

  //initialize array for Locations
  this.locationList = ko.observableArray([]);

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.95879, lng: -122.02186},
    zoom: 14,
    mapTypeControl: false

  //Centers compass map thingy
  this.centerMap = function() {
    map.setCenter({lat: 36.95879, lng: -122.02186});
  };

  this.listToggle = function() {
    if(self.toggleSymbol() === 'hide') {
      self.toggleSymbol('show');
    } else {
      self.toggleSymbol('hide');
    }
  };

  initialLocations.forEach(function(locationItem) {
    self.locationList.push( new Location(locationItem));
  });

  this.filteredList = ko.computed( function() {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem) {
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var string = locationItem.name.toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);
}

//Errors
function.errorHandling() {
  $('map').html("Something went wrong with Google Maps.");
}

function startApp() {
  ko.applyBindings(new ViewModel());
}
