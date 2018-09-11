var earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create map object
var myMap = L.map("map", {
    center: [35, -30],
    zoom: 2
});

// adding tile layer
let baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap)

// colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
colors = ['#f9f871', '#deae67', '#fdb451', '#e77352', '#b93c5a', '#78185c', '#693a82', '#260d4e']

function perFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.place + " " + "<br>Magnitude: " + feature.properties.mag);
    }
}
fetch(earthquake)
    .then(res => res.json())
    .then(out => {
        //         console.log(out)

        function getColor(mag) {

            return mag > 8 ? colors[7] :
                mag > 7 ? colors[6] :
                mag > 6 ? colors[5] :
                mag > 5 ? colors[4] :
                mag > 4 ? colors[3] :
                mag > 3 ? colors[2] :
                mag > 2 ? colors[1] :
                colors[0]
        }

        let myLayer = L.geoJson(out.features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 1.5,
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: .5,
                    color: getColor(feature.properties.mag),
                    stroke: false
                });
            },

            onEachFeature: perFeature,
        })
        myLayer.addTo(myMap)
       

        // LEGEND

        var legend = L.control({ position: "topleft" });

        legend.onAdd = function (myMap) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 2, 3, 4, 5, 6, 7, 8],
                labels = [],
                from, to;

                div.innerHTML+='Magnitude<br><hr>'

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

            }
            return div;
        };
        legend.addTo(myMap);
    })



//         from = scale[i];
//         to = scale[i + 1];

//         labels.push(
//             '<i style="background:' + getColor(from + 1) + '"></i> ' +
//             from + (to ? '&ndash;' + to : '+'));
//     }

//     div.innerHTML = labels.join('<br>');
//     return div;
// };

// legend.addTo(map)
//     });