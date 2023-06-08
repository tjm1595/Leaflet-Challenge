// Store API endpoing as queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create Basemap and Map Variables then add basemap layer
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let map = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 3
      });

      basemap.addTo(map);

// Call in JSON file 
 d3.json(queryURL).then(function(data) {

    // Style the earthquake data to get colors and radius for each earthquake
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            color: "#000000",
            fillColor: chooseColor(feature.properties.mag),
            radius: getRadius(features.properties.mag),
            stroke:true,
            weight: 0.5
        };
    }

 
    //Colors each earthquake marker based on magnitude
    function getColor(depth) {
        switch (true) {
            case(1.0 <= mag && mag <= 2.5):
                return "#0071BC"; 
            case (2.5 <= mag && mag <=4.0):
                return "#35BC00";
            case (4.0 <= mag && mag <=5.5):
                return "#BCBC00";
            case (5.5 <= mag && mag <= 8.0):
                return "#BC3500";
            case (8.0 <= mag && mag <=20.0):
                return "#BC0000";
            default:
                return "#E2FFAE";
        };
    }

    //Radius of Earthquake Markers based on Magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    //Add GeoJSON Layer
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleInfo,

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                +"<br>Location: "
                +feature.properties.place
            );
        }
    }).addTo(map);

//Create Legend
let legend = L.control({
    postion: "bottomright"
});

    legend.onAdd = function () {
        let div = L.DomUtil.create("div","info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
        
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

    };

// Add Legend
legend.addTo(map);
});