// var dbpath = "../static/data/energymerged.json"
dbpath = "http://127.0.0.1:5000/energymerged"
dbpath ="https://renewable-energy-project.herokuapp.com/energymerged"

d3.json(dbpath).then(function (dataSample) {
    console.log(dataSample);
    var filteredData = dataSample.filter(data => data.source !== "Biofuels");
    var countries = filteredData.map(d => d.country)
    var uniqueNames = countries.filter((value, index, self) => self.indexOf(value) === index);
    console.log(uniqueNames)
    uniqueNames.forEach(item =>
        d3.select("#selectButton")
            .append("option")
            .text(item)
    );
});

// Function to plot line chart for deaths due to air pollution - country wise
function stackBarChart(selectedId) {
    d3.json(dbpath).then(function (dataSample) {
        selectedCountry = dataSample[0].country;
        var dataObj = dataSample.filter(data => data.country === selectedId);
        var solarObj = dataObj.filter(data => data.source === "Solar");
        var windObj = dataObj.filter(data => data.source === "Wind");
        var hydroObj = dataObj.filter(data => data.source === "Hydro");

        console.log(solarObj);
        getYears = dataObj.map(data => data.year)

        // dataObj = dataObj.reverse();
        //console.log(getYears);
        
        var trace1 = {
            x: dataObj.map(data => data.year),
            y: solarObj.map(data =>data.units),
            type:"bar",
            name:'Solar Energy'

        };

        var trace2 = {
            x: dataObj.map(data => data.year),
            y: windObj.map(data =>data.units),
            type:"bar",
            name: 'Wind Energy'
        };

        var trace3 = {
            x: dataObj.map(data => data.year),
            y: hydroObj.map(data =>data.units),
            // line: {color: "rgb(219, 64, 82)"},
            type:"bar",
            name: "Hydro Energy"
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            title: 'Renewable Energy Generation by Country in Units(Twh)',
            xaxis: { title: "Year" },
            yaxis: { title: "Units(Twh)" },
            barmode:'stack'
        };

        Plotly.newPlot('myDiv', data, layout);
    });
}

function consumePChart(selectedId) {
    d3.json(dbpath).then(function (dataSample) {
        // selectedCountry = dataSample[0].country;
        var dataObj = dataSample.filter(data => data.country === selectedId);
        var solarObj = dataObj.filter(data => data.source === "Solar");
        var windObj = dataObj.filter(data => data.source === "Wind");
        var hydroObj = dataObj.filter(data => data.source === "Hydro");

        console.log(solarObj);
        getYears = dataObj.map(data => data.year)

        // dataObj = dataObj.reverse();
        //console.log(getYears);
        
        var trace1 = {
            x: dataObj.map(data => data.year),
            y: solarObj.map(data =>data.percent),
            type:"bar",
            name:'Solar Energy'

        };

        var trace2 = {
            x: dataObj.map(data => data.year),
            y: windObj.map(data =>data.percent),
            type:"bar",
            name: 'Wind Energy'
        };

        var trace3 = {
            x: dataObj.map(data => data.year),
            y: hydroObj.map(data =>data.percent),
            // line: {color: "rgb(219, 64, 82)"},
            type:"bar",
            name: "Hydro Energy"
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            title: 'Renewable Energy Consumption by Country (Twh)',
            xaxis: { title: "Year" },
            yaxis: { title: "Consumption (Twh)" },
            barmode:'stack'
        };

        Plotly.newPlot('plot-perc', data, layout);
    });
}

function solarChart(selectedId) {
    d3.json(dbpath).then(function (dataSample) {
        // selectedCountry = dataSample[0].country;
        var dataObj = dataSample.filter(data => data.country === selectedId);
        var solarObj = dataObj.filter(data => data.source === "Solar");
        var xSavings = solarObj.map(data =>data.percent);        

        var xNetworth = solarObj.map(data =>data.units);
        var ySavings = dataObj.map(data => data.year);
        var yNetworth = dataObj.map(data => data.year);

        var minSolarU = d3.min(xNetworth);
        var maxSolarU = d3.max(xNetworth);
        var minSolarP = d3.min(xSavings);
        var maxSolarP = d3.max(xSavings);

        interval_1 = ((maxSolarP - minSolarP)/5).toFixed(0)
        interval_2 = ((maxSolarU - minSolarU)/5).toFixed(0)


          var trace1 = {
            x: xSavings,
            y: ySavings,
            xaxis: 'x1',
            yaxis: 'y1',
            type: 'bar',
            marker: {
              color: 'rgba(50,171,96,0.6)',
              line: {
                color: 'rgba(50,171,96,1.0)',
                width: 1
              }
            },
            name: 'Solar Energy Consumption in %',
            orientation: 'h'
          };
          
          var trace2 = {
            x: xNetworth,
            y: yNetworth,
            xaxis: 'x2',
            yaxis: 'y1',
            mode: 'lines+markers',
            line: {
              color: 'rgb(128,0,128)'
            },
            name: 'Solar Energy Generation'
          };
          
          var data = [trace1, trace2];
          
          var layout = {
            title: 'Solar Energy Generation vs Consumption',
            xaxis1: {
              range: [minSolarP, maxSolarP],
              domain: [0, 0.5],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true
            },
            xaxis2: {
              range: [minSolarU,maxSolarU],
              domain: [0.5, 1],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true,
              side: 'top',
              dtick: interval_2
            },
            legend: {
              x: 0.029,
              y: 1.238,
              font: {
                size: 10
              }
            },
            margin: {
              l: 100,
              r: 20,
              t: 200,
              b: 70
            },
            width: 960,
            height: 600,
            paper_bgcolor: 'rgb(248,248,255)',
            plot_bgcolor: 'rgb(248,248,255)',
            annotations: [
              {
                xref: 'paper',
                yref: 'paper',
                x: -0.2,
                y: -0.109,
                text: 'Solar Energy Generartion',
                showarrow: false,
                font:{
                  family: 'Arial',
                  size: 10,
                  color: 'rgb(150,150,150)'
                }
              }
            ]
          };
        Plotly.newPlot('plot-solar', data, layout);
    });
}


//***********Wind */
function windChart(selectedId) {
    d3.json(dbpath).then(function (dataSample) {
        selectedCountry = dataSample[0].country;
        var dataObj = dataSample.filter(data => data.country === selectedId);
        var windObj = dataObj.filter(data => data.source === "Wind");
        var xSavings = windObj.map(data =>data.percent);
          
        var xNetworth = windObj.map(data =>data.units);
        var ySavings = dataObj.map(data => data.year);
        var yNetworth = dataObj.map(data => data.year);
        var minWindU = d3.min(xNetworth);
        var maxWindU = d3.max(xNetworth);
        var minWindP = d3.min(xSavings);
        var maxWindP = d3.max(xSavings);

        // interval_1 = ((maxSolarP - minSolarP)/5).toFixed(0)
        interval_2 = ((maxWindU - minWindU)/5).toFixed(0)

          var trace1 = {
            x: xSavings,
            y: ySavings,
            xaxis: 'x1',
            yaxis: 'y1',
            type: 'bar',
            marker: {
              color: 'rgba(50,171,96,0.6)',
              line: {
                color: 'rgba(50,171,96,1.0)',
                width: 1
              }
            },
            name: 'Wind Energy Consumption in %',
            orientation: 'h'
          };
          
          var trace2 = {
            x: xNetworth,
            y: yNetworth,
            xaxis: 'x2',
            yaxis: 'y1',
            mode: 'lines+markers',
            line: {
              color: 'rgb(128,0,128)'
            },
            name: 'Wind Energy Generation'
          };
          
          var data = [trace1, trace2];
          
          var layout = {
            title: 'Wind Energy Generation vs Consumption',
            xaxis1: {
              range: [minWindP, maxWindP],
              domain: [0, 0.5],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true
            },
            xaxis2: {
              range: [minWindU,maxWindU],
              domain: [0.5, 1],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true,
              side: 'top',
              dtick: interval_2
            },
            legend: {
              x: 0.029,
              y: 1.238,
              font: {
                size: 10
              }
            },
            margin: {
              l: 100,
              r: 20,
              t: 200,
              b: 70
            },
            width: 960,
            height: 600,
            paper_bgcolor: 'rgb(248,248,255)',
            plot_bgcolor: 'rgb(248,248,255)',
            annotations: [
              {
                xref: 'paper',
                yref: 'paper',
                x: -0.2,
                y: -0.109,
                text: 'Wind Energy Generartion',
                showarrow: false,
                font:{
                  family: 'Arial',
                  size: 10,
                  color: 'rgb(150,150,150)'
                }
              }
            ]
          };
        Plotly.newPlot('plot-wind', data, layout);
    });
}

//***********Hydro */
function hydroChart(selectedId) {
    d3.json(dbpath).then(function (dataSample) {
        selectedCountry = dataSample[0].country;
        var dataObj = dataSample.filter(data => data.country === selectedId);
        var hydroObj = dataObj.filter(data => data.source === "Hydro");
        var xSavings = hydroObj.map(data =>data.percent);
          
        var xNetworth = hydroObj.map(data =>data.units);
        var ySavings = dataObj.map(data => data.year);
        var yNetworth = dataObj.map(data => data.year);
        var minHydroU = d3.min(xNetworth);
        var maxHydroU = d3.max(xNetworth);
        var minHydroP = d3.min(xSavings);
        var maxHydroP = d3.max(xSavings);

        interval_2 = ((maxHydroU - minHydroU)/5).toFixed(0)

          var trace1 = {
            x: xSavings,
            y: ySavings,
            xaxis: 'x1',
            yaxis: 'y1',
            type: 'bar',
            marker: {
              color: 'rgba(50,171,96,0.6)',
              line: {
                color: 'rgba(50,171,96,1.0)',
                width: 1
              }
            },
            name: 'Hydro Energy Consumption in %',
            orientation: 'h'
          };
          
          var trace2 = {
            x: xNetworth,
            y: yNetworth,
            xaxis: 'x2',
            yaxis: 'y1',
            mode: 'lines+markers',
            line: {
              color: 'rgb(128,0,128)'
            },
            name: 'Hydro Energy Generation'
          };
          
          var data = [trace1, trace2];
          
          var layout = {
            title: 'Hydro Energy Generation vs Consumption',
            xaxis1: {
              range: [minHydroP, maxHydroP],
              domain: [0, 0.5],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true
            },
            xaxis2: {
              range: [minHydroU,maxHydroU],
              domain: [0.5, 1],
              zeroline: false,
              showline: false,
              showticklabels: true,
              showgrid: true,
              side: 'top',
              dtick: interval_2
            },
            legend: {
              x: 0.029,
              y: 1.238,
              font: {
                size: 10
              }
            },
            margin: {
              l: 100,
              r: 20,
              t: 200,
              b: 70
            },
            width: 960,
            height: 600,
            paper_bgcolor: 'rgb(248,248,255)',
            plot_bgcolor: 'rgb(248,248,255)',
            annotations: [
              {
                xref: 'paper',
                yref: 'paper',
                x: -0.2,
                y: -0.109,
                text: 'Hydro Energy Generartion',
                showarrow: false,
                font:{
                  family: 'Arial',
                  size: 10,
                  color: 'rgb(150,150,150)'
                }
              }
            ]
          };
        Plotly.newPlot('plot-hydro', data, layout);
    });
}


//*********Option Change */
function optionChanged(selectItem) {
    console.log("optionChanged.......")
    stackBarChart(selectItem)
    consumePChart(selectItem)
    solarChart(selectItem)
    windChart(selectItem)
    hydroChart(selectItem)
}
function init() {
    d3.json(dbpath).then(function (dataSample) {                
        var firstItem = dataSample[0].country;
        console.log(`first item :  ${firstItem}`);
        stackBarChart(firstItem);
        consumePChart(firstItem);
        solarChart(firstItem);
        windChart(firstItem);
        hydroChart(firstItem)
    });
}
init()


