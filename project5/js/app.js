var map;
var markers = [];

//List of locations, these would normally be in a database
var locations = [
  {title: 'Eldorado Resort Casino', location: {lat: 39.52947, lng: -119.81497}},
  {title: 'Atlantis Casino Resort Spa', location: {lat: 39.48890, lng: -119.79369}},
  {title: 'Silver Legacy Reno', location: {lat: 39.53045, lng: -119.81517}},
  {title: 'Circus Circus Reno', location: {lat: 39.53179, lng: -119.81529}},
  {title: 'Grand Sierra Resort', location: {lat: 39.52316, lng: -119.77842}},
  {title: 'Peppermill Reno', location: {lat: 39.49687, lng: -119.80213}}
];

var selectedLocation;
var selectedMarke;
var map = null;
//Create map
function initMap() {
        var reno = {lat: 39.5067, lng: -119.7899};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: reno
        });


        var bounds = new google.maps.LatLngBounds();

        //Create Infowindow
        var largeInfowindow = new google.maps.InfoWindow();

        //Marker color animation
        var defaultIcon = makeMarkerIcon('00B4CC');

        var highlightedIcon = makeMarkerIcon('FFFF24');

        //Create Markers from locations array

        for (var i=0; i < locations.length; i++) {
          var position = locations[i].location;
          var title = locations[i].title;

          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
          });

          markers.push(marker);

          bounds.extend(marker.position);

if(selectedLocation) {
  populateInfoWindow(selectedMarker, largeInfowindow);
}
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });

          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });

          map.fitBounds(bounds);

        }
        //WikiAPI to populate each markers infowindow
        function populateInfoWindow(marker, infowindow) {
          if (infowindow.marker != marker) {
            infowindow.marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              marker.setAnimation(null);
            }, 1500);
            //infowindow.setContent(getContentString(marker));
            //infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
              infowindow.marker=null;
            });
			var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
			var articleStr;
      var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Error with Wikipedia resources");
      }, 8000);
			var contentString = '<h3' + marker.title + '</h3';
			$.ajax({
				url: wikiUrl,
				dataType: "jsonp",
				beforeSend: function(){
					infowindow.setContent('loading..');
					infowindow.open(map,marker);
				},
				//jsonp : "callback"
				success: function(response) {
				var articleList = response[1];
				console.log(response);
				for (var i = 0; i < articleList.length; i++) {
					articleStr = articleList[i];
					var url = 'http://en.wikipedia.org/wiki/' + articleStr;
					contentString = contentString + '<div class="infoWindow"><h1><strong>' + marker.title + '</strong></h1><br>' + '<p>' + "View Resort Article Here:" + '<p>' + '<a href=\"' + url + '\">' + url + '</a>' + '<br>';
				}
				clearTimeout(wikiRequestTimeout);
				infowindow.setContent(contentString);

			  }
			});
      }
    }

        function makeMarkerIcon(markerColor) {
          var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
          return markerImage;
        }

}

//Begin ViewModel
var myViewModel = function() {
  var self = this;

this.filter = ko.observable('');

this.showSidePanel = ko.observable(true);

this.deviceType = function() {
	if ($(window).width() > 960)
    layoutType('normal');
  else if ($(window).width() <= 960)
    layoutType('compact');

	return layoutType;
};

this.switchPanel = function() {
  this.showSidePanel(!this.showSidePanel());
};
  this.placesList = ko.observableArray([
    {title: 'Eldorado Resort Casino', location: {lat: 39.52947, lng: -119.81497}},
    {title: 'Atlantis Casino Resort Spa', location: {lat: 39.48890, lng: -119.79369}},
    {title: 'Silver Legacy Reno', location: {lat: 39.53045, lng: -119.81517}},
    {title: 'Circus Circus Reno', location: {lat: 39.53179, lng: -119.81529}},
    {title: 'Grand Sierra Resort', location: {lat: 39.52316, lng: -119.77842}},
    {title: 'Peppermill Reno', location: {lat: 39.49687, lng: -119.80213}}
  ]);

  this.filter.subscribe( (newValue) => {
    this.placesList([]);
	for(var i=0; i< markers.length; i++) {
		if(!markers[i].title.toUpperCase().includes(newValue.toUpperCase())) {
			markers[i].setMap(null);
		} else {
			markers[i].setMap(map);
		}
	}
    for(var i=0; i< locations.length; i++) {
      if(locations[i].title.toUpperCase().includes(newValue.toUpperCase())) {
        this.placesList.push(locations[i]);

      }
    }
  }, this);
  this.showPopup = function(index, data) {
	  console.log(data);
	  var mark = null;
	  for(var i=0; i< markers.length; i++) {
		  if(markers[i].title === data.title) {
			  mark = markers[i];
			  break;
		  }
	  }
    var position = mark.location;
    var title = mark.title;

    var defaultIcon = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + '00B4CC' +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          id: index,
          icon: defaultIcon
        });
    selectedMarker = marker;
    google.maps.event.trigger(mark, 'click');
    selectedLocation = true;
    //initMap();
  };

};

ko.applyBindings(new myViewModel());

function errorHandling() {
  alert("Something went wrong with Google Maps. Please try again.");
}
