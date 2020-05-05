am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

var mapData = [
    { "id":"BD", "name":"Bangladesh", "value":161, "color": chart.colors.getIndex(0) },
    { "id":"IN", "name":"India", "value":238, "color": chart.colors.getIndex(0) },
    { "id":"PH", "name":"Philipines", "value":189, "color": chart.colors.getIndex(0) },
    { "id":"ET", "name":"Ethiopia", "value":214, "color":chart.colors.getIndex(1) },
    { "id":"GH", "name":"Ghana", "value":180, "color":chart.colors.getIndex(1) },
    { "id":"NE", "name":"Niger", "value":145, "color":chart.colors.getIndex(1) },
    { "id":"NG", "name":"Nigeria", "value":78, "color":chart.colors.getIndex(1) },
    { "id":"PA", "name":"Panama", "value":115, "color":chart.colors.getIndex(4) },
    { "id":"PR", "name":"Puerto Rico", "value":79, "color":chart.colors.getIndex(4) },
];

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AQ"];
polygonSeries.useGeodata = true;
polygonSeries.nonScalingStroke = true;
polygonSeries.strokeWidth = 0.5;
polygonSeries.calculateVisualCenter = true;

var imageSeries = chart.series.push(new am4maps.MapImageSeries());
imageSeries.data = mapData;
imageSeries.dataFields.value = "value";

var imageTemplate = imageSeries.mapImages.template;
imageTemplate.nonScaling = true

var circle = imageTemplate.createChild(am4core.Circle);
circle.fillOpacity = 0.7;
circle.propertyFields.fill = "color";
circle.tooltipText = "[bold]{value}[/] reports from [bold]{name}[/]";


imageSeries.heatRules.push({
    "target": circle,
    "property": "radius",
    "min": 4,
    "max": 30,
    "dataField": "value"
})

imageTemplate.adapter.add("latitude", function(latitude, target) {
    var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
    if(polygon){
    return polygon.visualLatitude;
    }
    return latitude;
})

imageTemplate.adapter.add("longitude", function(longitude, target) {
    var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
    if(polygon){
    return polygon.visualLongitude;
    }
    return longitude;
})



}); 