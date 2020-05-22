// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"


//create function to set color for different magnitude
function getColor(magnitude) {
    if (magnitude >= 5) {
        return "darkred";
    }
    else if (magnitude >= 4) {
        return "tomato";
    }
    else if (magnitude >= 3) {
        return "orange";
    }
    else if (magnitude >= 2) {
        return "yellow";
    }
    else if (magnitude >= 1) {
        return "yellowgreen";
    }
    else  {
        return "darkgreen";
    }
};

//define circleSize function
function circleSize(magnitude) {
    return magnitude *2;
}
// Perform a GET request to the query URL
var data = d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
     createFeatures(data.features);
    console.log(data.features)
  });

  function createFeatures(earthquakeData) {

    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag),
            fillOpacity: 3,
            color: "black",
            weight: .8,
            fillColor:getColor(feature.properties.mag)
        });
    }

    // Define a function to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: onEachLayer  

    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {

  // Add a tile layer (the background map image) to our map

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY

});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

    // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      30, -100
    ],
    zoom: 4.4,
    layers: [streetmap, earthquakes]
  });

  var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'legend'),
        lower = [0,1,2,3,4,5],
        upper = [1,2,3,4,5,"+"]

        div.innerHTML +=
        "<h4>Magnitude Of Earthquakes</h4>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < lower.length; i++) {
        div.innerHTML +=
        
            '<i style="background:' + getColor(lower[i] + 1) + '"></i> ' +
            lower[i] + '&ndash;' + upper[i]+'<br>';
   }
   
    return div;
};

    legend.addTo(myMap);

    // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

    
 




  


  