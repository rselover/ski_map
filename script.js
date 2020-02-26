// update your access token here
L.mapbox.accessToken = "pk.eyJ1IjoicnNlbG92ZXIiLCJhIjoiY2pheTV6d29pNmVhdzJxbnE3dXg2dXQ2biJ9.slYZMX69SixQyKLWvKCfjw";

var map = L.mapbox.map('map', 'mapbox.light') // update with your own map id
        .setView([39.7555, -105.2211], 9);

  var listings = document.getElementById('listings');
  var locations = L.mapbox.featureLayer().addTo(map);

  locations.loadURL('https://skimapflask.rselover.repl.co/'); // load in your own GeoJSON file here

  function setActive(el) {
    var siblings = listings.getElementsByTagName('div');
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].className = siblings[i].className
        .replace(/active/, '').replace(/\s\s*$/, '');
    }

    el.className += ' active';
  }

  locations.on('ready', function() {
    locations.eachLayer(function(locale) {

      // Shorten locale.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = locale.feature.properties;

      // Each marker on the map.
      var popup = "<h3>"+prop.name+"</h3> Walkup Price: $" + prop.walkup;

      var listing = listings.appendChild(document.createElement('div'));
          listing.className = 'item';

      var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';

      link.innerHTML = prop.name;

      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = "Walkup: $"+prop.walkup+ " - Distance from Denver: "+prop.distance+" miles";
      link.onclick = function() {
        setActive(listing);

        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
        map.setView(locale.getLatLng(), 16);
        locale.openPopup();
        return false;
      };

      // Marker interaction
      locale.on('click', function(e) {
          // 1. center the map on the selected marker.
          map.panTo(locale.getLatLng());

          // 2. Set active the markers associated listing.
          setActive(listing);
      });

      popup += '</div>';
      locale.bindPopup(popup);
    });
  });

  locations.on('layeradd', function(e) {
    var marker = e.layer;
    marker.setIcon(L.icon({
      iconUrl: 'https://image.flaticon.com/icons/svg/1/1227.svg', // load your own custom marker image here
      iconSize: [56, 56],
      iconAnchor: [28, 28],
      popupAnchor: [0, -34]
    }));
  });