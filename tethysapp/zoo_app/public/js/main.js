var applicableCosts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
var currentCosts = applicableCosts;

function styleFunction(feature) {
    console.log('Checking a feature');
    var cost = feature.get('cost');
    var costs = Number(cost);
    console.log(currentCosts);
    console.log(costs);
    var showFeature = false;
    for (var i = 0; i < currentCosts.length; i++) {
        console.log('Next feature');
        /* for (var j = 0; j < costs.length; j++) {
            console.log('Current cost: ' + currentCosts[i]);
            console.log('Feature\'s cost: ' + costs[j]);
            console.log('Equality: ' + (Number(costs[j]) == currentCosts[i]).toString()); */
            if (costs === currentCosts[i]) {
                showFeature = true;
            }
    }
    if (showFeature) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: '/static/zoo_app/images/paw.gif',
                scale: 0.05
            })
        });
    } else {
        var fill = new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
        });
        var stroke = new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0)'
        });
        var radius = 0;
        return new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: radius
            }),
            fill: fill,
            stroke: stroke
        });
    }
}


var projection = ol.proj.get('EPSG:3857');

var baseLayer = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        key: '5TC0yID7CYaqv3nVQLKe~xWVt4aXWMJq2Ed72cO4xsA~ApdeyQwHyH_btMjQS1NJ7OHKY8BK-W-EMQMrIavoQUMYXeZIQOUURnKGBOC7UCt4',
        imagerySet: 'AerialWithLabels' // Options 'Aerial', 'AerialWithLabels', 'Road'
    })
});

var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
            url: '/static/zoo_app/kml/doc.kml',
            format: new ol.format.KML({
                extractStyles: false
            })
        }),
        style: styleFunction
});

var view = new ol.View({
        center: [-11500000, 4735000],
        projection: projection,
        zoom: 4,
})

var map = new ol.Map({
    target: document.getElementById('map'),

    //Set up the layers that will be loaded in the map
    layers: [baseLayer, vector],

    //Establish the view area. Note the reprojection from lat long (EPSG:4326) to Web Mercator (EPSG:3857)
    view: view
});

map.addControl(new ol.control.ZoomSlider());



//Here we create the pop ups
var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);

// display popup on click
map.on('click', function(evt) {
  //try to destroy it before doing anything else...s
  $(element).popover('destroy');

  //Try to get a feature at the point of interest
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });

  //if we found a feature then create and show the popup.
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    var displaycontent = feature.get('description');
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': displaycontent
    });

    $(element).popover('show');

  } else {
    $(element).popover('destroy');
  }
});

//change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(element).popover('destroy');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});


$(function() {
    $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 52,
    values: [ 0, 52 ],
    change: function( event, ui ) {
    var range = ui.values;
    var lowerCost = range[0];
    var upperCost = range[1];
    var showCosts = [];
    for (var i = lowerCost; i <= upperCost; i++) {
        for (var j = 0; j < applicableCosts.length; j++) {
            if (i == applicableCosts[j]) {
                showCosts.push(i);
            }
        }
        currentCosts = showCosts;
        vector.getSource().changed();
    }
    },
    slide: function( event, ui ) {
        $( "#amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
        });

    $( "#amount" ).val($( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );
        });

