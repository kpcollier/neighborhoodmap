var map;
var markers = [];
function initMap() {
        var reno = {lat: 39.5067, lng: -119.7899};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
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

        var bounds = new google.maps.LatLngBounds();

        //Create Infowindow
        var largeInfowindow = new google.maps.InfoWindow();

        var defaultIcon = makeMarkerIcon('0091ff');

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

          marker.addListener('click', function() {
            getData();
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

        function populateInfoWindow(marker, infowindow) {
          if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(getContentString(marker));
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
              infowindow.setMarker(null);
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

};

function getData(){
  var wikiUrl = 'http://wikipedia.org/w/api.php?action=&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function() {
    alert("wiki failed")
  }, 8000);
  var articleStr;
  var contentString = '<h3' + marker.title + '</h3';
  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    //jsonp : "callback"
    success: function(response) {
      var articleList = response[1];
      console.log(response);
      for (var i = 0; i < articleList.length; i++) {
        articleStr = articleList[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        contentString = contentString + '<a href=\"' + url + '\">' + url + '</a>' + '<br>';

      };
      clearTimeout(wikiRequestTimeout);
    }
  });
}

function getContentString(marker) {
  var contentString = '<div class="infoWindow"><h3>' + marker.title + '</h3></div>';

  return contentString;
}
