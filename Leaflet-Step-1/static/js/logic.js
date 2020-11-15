function markerSize(mag) {

    if (mag <= 1) {
        return "3";
    } else if (1 < mag & mag <= 2.00) {
        return "7";
    } else if (2.00 < mag & mag <= 2.75) {
        return "12";
    } else if (2.75 < mag & mag <= 3.00) {
        return "16";
    } else if (3.00 < mag & mag <= 3.5) {
        return "20";  
    } else if (3.5 < mag & mag <= 4.00) {
        return "25";  
    } else if (4.00 < mag & mag <= 4.75) {
        return "30";    
    } else if (4.75 < mag & mag <= 5.00) {
        return "35";
    } else if (5.00 < mag & mag <= 5.25) {
        return "39";
    } else if (5.25 < mag & mag <= 5.50) {
        return "42";
    } else {
        return "48";
    };
  }

  function markerColor(depth) {

    if (depth < -10) {
        return "#00a4f7";
    } else 
    if (-10 <= depth & depth < 10) {
        return "#b0bc0a";
    } else if (10 <= depth & depth < 30) {
        return "#92babb";
    } else if (30 <= depth & depth < 50) {
        return "#f7c200";
    } else if (50 <= depth & depth < 70) {
            return "#f70054";
    } else if (70 <= depth & depth < 90) {
        return "#a13d2d";       
    } else {
        return "#f700f7";
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

    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  
    // Create a baseMaps object to hold the layers
    var baseMaps = {
      "Satelite Map": satmap,
      "Dark Map": darkmap,
      "Street Map":streetmap
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
      var depth = [-10, 10, 30, 50, 70, 90];

      depth.forEach(d => {
        var range = `${d} to ${d+20}`;
        if (d >= 90) 
            {range = `${d}+`}
        if (d == 0)
            {range = `<= -10`}

        var html = `<div class="legend-item">
              <div style="height: 15px; width: 30px; background-color:${markerColor(d)}"> </div>
              <div class=legend-text>Depth: <strong>${range}</strong></div>
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

      var earthquakeMarkers = []
  
      for (var index = 0; index < earthquakes.length; index++) {
          var earthquake = earthquakes[index];
          console.log(earthquake)

  
          var marker = L.circleMarker([ earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0] ], {
                  //radius: earthquake.properties.mag * 2,
                  radius : markerSize(earthquake.properties.mag),
                  //fillColor: markerColor(earthquake.properties.mag),
                  fillColor:markerColor(earthquake.geometry.coordinates[2]),
                  color: "black",
                  weight:2,
                  opacity:1,
                  fillOpacity: 1,
                  stroke: true
              }
              ).bindPopup("<h4>" + earthquake.properties.place + 
              "</h4><hr><p>" + 
              new Date (earthquake.properties.time) +
               "</p>" + 
               "<p><b>Magnitude: " +  
               earthquake.properties.mag + 
               "<b></p>" +
               "<p><b>Depth: " +  
               earthquake.geometry.coordinates[2] + 
               "<b></p>"
               );
  
          earthquakeMarkers.push(marker);
      }
      createMap(L.layerGroup(earthquakeMarkers));
  
  }
  
  
  // Perform an API call to USGS API to get earthquake data 
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  
