function markerColor(mag) {

    if (mag <= 4.75) {
        return "#1635D9";
    } else if (4.75 < mag & mag <= 5.00) {
        return "#13DECE";
    } else if (5.00 < mag & mag <= 5.25) {
        return "#12E510";
    } else if (5.25 < mag & mag <= 5.50) {
        return "#DCEB0C";
    } else {
        return "#F02908";
    };
  }
  
  
  // Create the createMap function
  function createMap(earthquakes) {
  
    // Create two tile layer options that will be the background of our map
    var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the layers
    var baseMaps = {
      "Satelite Map": satmap,
      "Dark Map": darkmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Creating map, giving it the satelite map and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [satmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  
    // Create legend
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = () => {
      var div = L.DomUtil.create('div', 'info legend');
      var magnitudes = [4.75, 5.0, 5.25, 5.5, 5.75];
  
      magnitudes.forEach(m => {
        var range = `${m} - ${m+0.25}`;
        if (m >= 5.75) {range = `${m}+`}
        var html = `<div class="legend-item">
              <div style="height: 25px; width: 25px; background-color:${markerColor(m)}"> </div>
              <div class=legend-text>Magnitude:- <strong>${range}</strong></div>
          </div>`
        div.innerHTML += html
      });
      return div;
    };
    legend.addTo(myMap);
  }
  
  // Create Markers function
  function createMarkers(response) {
  
      var earthquakes = response.features;
      console.log(earthquakes)

      var earthquakeMarkers = []
  
      for (var index = 0; index < earthquakes.length; index++) {
          var earthquake = earthquakes[index];
  
          var marker = L.circleMarker([ earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0] ], {
                  radius: earthquake.properties.mag * 2,
                  fillColor: markerColor(earthquake.properties.mag),
                  fillOpacity: 0.75,
                  stroke: false
              }
              ).bindPopup("<h4>" + earthquake.properties.place + "</h4><hr><p>" + new Date (earthquake.properties.time) + "</p>" + "<p><b>Magnitude: " +  earthquake.properties.mag + "<b></p>");
  
          earthquakeMarkers.push(marker);
      }
      createMap(L.layerGroup(earthquakeMarkers));
  
  }
  
  
  // Perform an API call to USGS API to get earthquake data 
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  
