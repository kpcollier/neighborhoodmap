

var map;
var markers = [];

function initMap() {
        var reno = {lat: 39.5067, lng: -119.7899};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: reno
        });

        var locations = [
          {title: 'Eldorado Resort Casino', location: {lat: 39.52947, lng: -119.81497}},
          {title: 'Atlantis Resort Casino', location: {lat: 39.48890, lng: -119.79369}},
          {title: 'Silver Legacy Resort Casino', location: {lat: 39.53045, lng: -119.81517}},
          {title: 'Circus Circus Reno', location: {lat: 39.53179, lng: -119.81529}},
          {title: 'Grand Sierra Resort', location: {lat: 39.52316, lng: -119.77842}},
          {title: 'Peppermill Resort Spa Casino', location: {lat: 39.49687, lng: -119.80213}}
        ];

        //Make infowindows

        var largeInfoWindow = new google.maps.InfoWindow();

        //Uses location array to create array of markers on initialize
        for (var i = 0, i < locations.length; i++) {
          var position = locations[i].location;
          var title = locations[i].title;

          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.BOUNCE,
            icon: defaultIcon,
            id: i
          });

          markers.push(marker);

          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
          });
        }

        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);

        function populateInfoWindow(marker, infowindow) {
          if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
            });
          }
        }
};
