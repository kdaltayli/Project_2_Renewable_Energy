// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map-id", {
    center: [39.36827914916014, -6.6796875],
    zoom: 2
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
    id: 'mapbox/light-v9',
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(myMap);

function getColor(d) {
    return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
            d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
            d > 20 ? '#FEB24C' :
            d > 10 ? '#FED976' :
                    '#FFEDA0';
}

// source_data_path = "../static/data/energymerged.json";
// gdp_data_path = "../static/data/countrygdp.json";

source_data_path = "http://127.0.0.1:5000/energymerged";
gdp_data_path = "http://127.0.0.1:5000/countrygdpdata";

console.log(gdp_data_path)


var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
}

//==============================================================================================
// Get top ten GDP countries
// function getCountryGDP(getCountryName, forYear) {
//     console.log("getgdp Fn:    " + getCountryName + " : " + forYear)
//     var clist = getCountryName
//     console.log(`clist :  ${clist}`)
//     d3.json(gdp_data_path, function(gdpData) {
//         console.log(gdpData);
//         // gdpObj = gdpData.filter(d => d.country === getCountryName && d.year === forYear);
        
//         // filteredArray = gdpData.filter( function( el ) {
//         //     return clist.includes( el.country );
//         //   });

//         // gdpObj = gdpData.filter(d => d.country in clist);
//         // console.log("gdpObj:  " + gdpObj[0].country + " " + gdpObj[0].year + "  " + gdpObj[0].gdp);
//         console.log(filteredArray)
//         // return (gdpObj[0].gdp);
//     });
// }
//===============================================================================================


function sumUnits(total, units) {
    return total + units;
}

function getCountryGDP(getCountryName, forYear) {
    var gdp_value = 0
    console.log("get gdp.........")
    try {
        d3.json(gdp_data_path, function(gdpData) {
            // console.log(gdpData);
            gdpObj = gdpData.filter(d => d.country === getCountryName && d.year === forYear);        
            // console.log(gdpObj)
            console.log(`${getCountryName}  GDP:  ${gdpObj[0].gdp}`)
            gdp_value = gdpObj[0].gdp
        });
    } catch(err) {
        console.log(`caught error ${err}`)
    }
    console.log(gdp_value)
    return (gdp_value);
}    

function getEnergyInfo(forData, forCountry, forYear, forSource) {
    units_rounded = 0
    try {
        console.log("In the function--------")
        filterData = forData.filter(d => d.country === forCountry 
                    && d.source === forSource && d.year === forYear); 
        console.log(filterData)
        units_rounded = filterData[0].units.toFixed(3)
    } catch(err) {
        console.log(`caught error ${err}`)
    }
    if(units_rounded === "0.000") {
        units_display = "No.data"
    }
    else {
        units_display = `${units_rounded}(Twh)`
    }
    return (units_display);
};

    

function CountryInfo(getCountryName, event) {
    console.log(getCountryName);
    // d3.json(data_path).then(function (energyData) {
    var years = [2010, 2019];
    var results = [];
    var units = []
    var total_units = []

    if (getCountryName === "United States of America") {
        getCountryName = "United States"
    }

    // function getEnergyInfo(forData, forYear) {
    //     console.log("In the function--------")
    //     filterData = forData.filter(d => d.country === getCountryName 
    //                 && d.source !== "Total" && d.year === forYear);         

    //     var mydict = {}
    //     var result_list = []
    //     for (var i=0; i < filterData.length; i++) {
    //         mydict[filterData[i].source] = filterData[i].units
    //         // result_list.push(mydict)
    //         // src_list.push(filterData[i].source)
    //         // unit_list.push(filterData[i].units)
    //     }
    //     // console.log(result_list)
    //     console.log(mydict)

    //     console.log(`mydict   ${mydict}`)
    // }

    console.log(source_data_path)
    d3.json(source_data_path, function (energyData) {
        console.log(energyData);
        
        if (event.target == modal) {
            modal.style.display = "none";
        }
        else {
            modal.style.display = "block";
            document.getElementById("description").innerText = getCountryName;

            document.getElementById("year-1").innerText = 2010

            hydro_units = getEnergyInfo(energyData, getCountryName, 2010, "Hydro");
            console.log(`hydro units:  ${hydro_units}`)
            document.getElementById("unit-water-1").innerText = hydro_units

            wind_units = getEnergyInfo(energyData, getCountryName, 2010, "Wind");
            console.log(`wind units:  ${wind_units}`)
            document.getElementById("unit-wind-1").innerText = wind_units

            solar_units = getEnergyInfo(energyData, getCountryName, 2010, "Solar");
            console.log(`solar units:  ${solar_units}`)
            document.getElementById("unit-sun-1").innerText = solar_units

            // bio_units = getEnergyInfo(energyData, getCountryName, 2010, "Biofuels");
            // console.log(`solar units:  ${bio_units}`)
            // document.getElementById("unit-bio-1").innerText = bio_units

            document.getElementById("year-2").innerText = 2019
            hydro_units = getEnergyInfo(energyData, getCountryName, 2019, "Hydro");
            console.log(`hydro units:  ${hydro_units}`)
            document.getElementById("unit-water-2").innerText = hydro_units

            wind_units = getEnergyInfo(energyData, getCountryName, 2019, "Wind");
            console.log(`wind units:  ${wind_units}`)
            document.getElementById("unit-wind-2").innerText = wind_units

            solar_units = getEnergyInfo(energyData, getCountryName, 2019, "Solar");
            console.log(`solar units:  ${solar_units}`)
            document.getElementById("unit-sun-2").innerText = solar_units
            
            

            d3.json(gdp_data_path, function(gdpData) {
                console.log(gdpData);
                gdpObj = gdpData.filter(d => d.country === getCountryName && d.year === 2010);        
                console.log(gdpObj)
                console.log(`${getCountryName}  GDP:  ${gdpObj[0].gdp}`)
                gdp_value = gdpObj[0].gdp.toFixed(3)
                if (gdp_value === "0.000") {
                    gdp_display = "No-data"
                }
                else {
                    gdp_display = "$." + gdp_value
                }
                document.getElementById("gdp-1").innerText = gdp_display

                gdpObj = gdpData.filter(d => d.country === getCountryName && d.year === 2019);        
                // console.log(gdpObj)
                console.log(`${getCountryName}  GDP:  ${gdpObj[0].gdp}`)
                gdp_value = gdpObj[0].gdp.toFixed(3)
                if (gdp_value === "0.000") {
                    gdp_display = "No.data"
                }
                else {
                    gdp_display = "$." + gdp_value
                }
                document.getElementById("gdp-2").innerText = gdp_display
            });            




            // bio_units = getEnergyInfo(energyData, getCountryName, 2019, "Biofuels");
            // console.log(`solar units:  ${bio_units}`)
            // document.getElementById("unit-bio-2").innerText = bio_units            

        }
    });
}




// // Load in geojson data
var geoData = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
// // Grab data with d3
d3.json(geoData, function (data) {
    countryData = data
    console.log(data)

    function style(feature) {
        return {
            fillColor: '#a6bddb',   //getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.08
        };
    }
    L.geoJson(countryData, { style: style }).addTo(myMap);

    // What to do when mouse over
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#666',
            dashArray: '',
            fillColor: '#78c679',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // What to do when Mouse Out
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    // Click Feature
    function zoomToFeature(e) {
        // myMap.fitBounds(e.target.getBounds());
        CountryInfo(e.sourceTarget.feature.properties.ADMIN, e);
        
        // new L.Control.BootstrapModal({
        //     modalId: 'modal_about',
        //     tooltip: "What is it?",
        //     glyph: 'info-sign'
        // }).addTo(MAP);
        
    }


    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    geojson = L.geoJson(countryData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(myMap);

    // var info = L.control();

    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    //     this.update();
    //     return this._div;
    // };
    // // method that we will use to update the control based on feature properties passed
    // info.update = function (props) {
    //     console.log(props)
    //     this._div.innerHTML = '<h4>Country</h4>' + (props ?
    //         '<b>' + props + ' people / mi<sup>2</sup>' : "somthing" );
            
    // };
    // info.addTo(myMap);
});



// L.geoJson(geoData).addTo(myMap);






//   // Create a new marker
//   // Pass in some initial options, and then add it to the map using the addTo method
//   var marker = L.marker([45.52, -122.67], {
//     draggable: true,
//     title: "My First Marker"
//   }).addTo(myMap);

//   // Binding a pop-up to our marker
//   marker.bindPopup("Hello There!");




// // // Grab data with d3
// d3.json(geoData, function(data) {

// // //   // Create a new choropleth layer
//   geojson = L.choropleth(data, {

//     // Define what  property in the features to use
//     valueProperty: "MHI2016",

//     // Set color scale
//     scale: ["#ffffb2", "#b10026"],

//     // Number of breaks in step range
//     steps: 10,

//     // q for quartile, e for equidistant, k for k-means
//     mode: "q",
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },

//     // Binding a pop-up to each layer
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//         "$" + feature.properties.MHI2016);
//     }
//   }).addTo(myMap);

//   // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);

// });

