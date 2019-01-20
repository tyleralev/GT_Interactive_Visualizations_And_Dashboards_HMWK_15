function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "metadata/${sample}"
  d3.json(url).then(function (meta){
    //console.log(m)
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaSample = document.getElementById('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metaSample.innerHTML = "";
    // Use `Object.entries` to add each key and value pair to the panel
    var metaItems = [["AGE","AGE"],["BBTYPE","BBTYPE"],["ETHNICITY","ETHNICITY"],["GENDER","GENDER"],
            ["LOCATION","LOCATION"],["sample","SAMPLEID"]];
    // Hint: Inside the loop, you will need to use d3 to append new
      for(i=0; i < metaItems.length; i++){
        var newLi = document.createElement('p');
        newLi.innerHTML = '<strong>${metaItems[i][1]}: ${meta[metaItems[i][0]]}</strong>';
        metaSample.appendChild(newLi);
      };
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var level = meta.WFREQ;
    buldGauge(level);
  })
}

function buildGauge(level) {
  //trig to calculater where meter should be
  var degrees = 180 - level*20,
    radius =.5;
  var radians = degrees * Math.PI/180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var dataGauge = [{ type: 'scatter',
      x: [0],
      y:[0],
      marker: {size: 16, color:'850000'},
      showlegend: false,
      name: 'Frequency',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker:
      {colors:[
          'rgba(0, 105, 11, .5)',
          'rgba(14, 127, 0, .5)',
          'rgba(110, 154, 22, .5)',
          'rgba(170, 202, 42, .5)',
          'rgba(185, 215, 65, .5)',
          'rgba(188, 182, 92, .5)',
          'rgba(202, 209, 95, .5)',
          'rgba(210, 206, 145, .5)',
          'rgba(232, 226, 202, .5)',
          'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

  var layoutGauge = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
      }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
      };
  // var gauge = document.getElementById('gauge');
  Plotly.newPlot('gauge', dataGauge, layoutGauge);
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/${sample}"
  d3.json(url).then(function(response) {

    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
        colorscale: "Rainbow"
      }
    };

    var dataBubble = [trace1];

    var layoutBubble = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 1800
    };

    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var layout = {
      height: 500,
      width: 500
    };

    Plotly.newPlot('pie', data, layout)
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
