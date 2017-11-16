
var initialLocations = [
  {
    name: 'Santa Cruz Beach Boardwalk',
    lat: 36.964234,
    long: -122.018831,

  },
  {
    name: 'The Wharf',
    lat: 36.957273,
    long: -122.028315,

  },
  {
    name: 'Lighthouse Field Surfing Museum',
    lat: 36.951374,
    long: -122.028315,

  },
  {
    name: 'Natural Bridges',
    lat: 36.952883,
    long: -122.056806,

  },
  {
    name: 'Monterey Bay National Marine Sanctuary Exploration Center',
    lat: 36.963239,
    long: -122.024619,

  }
];

//Declare Global Variables
var map;
var clientID;
var clientSecret;
var infoWindow;

//Google Maps Error
function errorHandling() {
	alert("Something went wrong with Google Maps.");
}

var Location = function(data) {
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.URL = "";
	this.street = "";
	this.city = "";
	this.phone = "";

	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;

//Using Foursquare API
	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		if (typeof self.URL === 'undefined'){
			self.URL = "";
		}
		self.street = results.location.formattedAddress[0];
     	self.city = results.location.formattedAddress[1];
      	self.phone = results.contact.phone;
      	if (typeof self.phone === 'undefined'){
			self.phone = "";
		} else {
			self.phone = formatPhone(self.phone);
		}
	}).fail(function() {
		alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
	});


	//Making the marker
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.long),
			map: map,
			title: data.name
	});

//Making the info window
	infoWindow = new google.maps.InfoWindow();

	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);



    this.showinfo = function(){

  //close previous info window
    	infoWindow.close();

		var contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

        infoWindow.setContent(contentString);

		infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	//Stop the animation
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);

    };

	this.marker.addListener('click', self.showinfo);

	this.bounce = function() {
		google.maps.event.trigger(self.marker, 'click');
	};


};

//Get the valid Phone number
function formatPhone(phonenum) {
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    }
    else {
        //invalid phone number
        return phonenum;
    }
}

//Begin ViewModel
function ViewModel() {
	var self = this;

//Create an array of all places
	this.locationList = ko.observableArray([]);

	this.searchTerm = ko.observable("");

//Create Map
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 14,
			center: {lat: 36.956273, lng: -122.031216}

	});
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < initialLocations.length; i++){

        bounds.extend(new google.maps.LatLng(initialLocations[i].lat,initialLocations[i].long));
	}

	map.fitBounds(bounds);

	// Foursquare API settings
	clientID = '3GLSBCS5G5SCSNMX5QXNEWGW2P4FBUDE0QGRD255VVL1M2VR';
  clientSecret = 'IL50X5OBDQ0JFUBOGOOL0UXI4DJY4TPVNMX1G4CI1MBTWUUX';

// Call the Location constructor
// Create Location objects for each item in locations & store them in the above array
	initialLocations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
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
	}, this);

	this.mapElem = document.getElementById('map');

}
//Runs a new application
function startApp() {
	ko.applyBindings(new ViewModel());
}
