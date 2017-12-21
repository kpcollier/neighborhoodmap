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

        var infowindow = new google.maps.InfoWindow();

        var bounds = new google.maps.LatLngBounds();

        for (var i=0; i < locations.length; i++) {
          var position = locations[i].location;
          var title = locations[i].title;

          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            console.log('debug');
            infowindow.setContent('');
            infowindow.open(map, marker);
          });

          markers.push(marker);
          bounds.extend(marker.position);

          marker.addListener('click', function() {
            infowindow.open(map, marker);

            map.fitBounds(bounds);
          });

        }


}
