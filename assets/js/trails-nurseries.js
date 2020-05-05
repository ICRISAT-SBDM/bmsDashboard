var chartNur = null;
am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
chartNur = am4core.create("trails-nurseries", am4maps.MapChart);

// Set map definition
chartNur.geodata = am4geodata_worldLow;

// Set projection
chartNur.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chartNur.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = chartNur.colors.getIndex(0).lighten(0.5);

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = chartNur.colors.getIndex(0);

// Add image series
var imageSeries = chartNur.series.push(new am4maps.MapImageSeries());
imageSeries.mapImages.template.propertyFields.longitude = "longitude";
imageSeries.mapImages.template.propertyFields.latitude = "latitude";
imageSeries.mapImages.template.propertyFields.hoverable = true;
imageSeries.data = [
  
  {
    "title": "Copenhagen",
    "latitude": 55.6763,
    "longitude": 12.5681,
    "nurseries": 6,
    "img": "images/us.jpg",
    "id": 2
  },
  
  {
    "title": "Reykjavik",
    "latitude": 64.1353,
    "longitude": -21.8952,
    "img": "images/us.jpg",
    "nurseries": 8,
    "id": 4
  },
  {
    "title": "Moscow",
    "latitude": 55.7558,
    "longitude": 37.6176,
    "img": "images/us.jpg",
    "nurseries": 9,
    "id": 5
  },
  {
    "title": "Madrid",
    "latitude": 40.4167,
    "longitude": -3.7033,
    "img": "images/us.jpg",
    "nurseries": 10,
    "id": 6
  },
  {
    "title": "London",
    "latitude": 51.5002,
    "longitude": -0.1262,
    "url": "http://www.google.co.uk",
    "img": "images/us.jpg",
    "nurseries": 11,
    "id": 7
  },
  {
    "title": "Peking",
    "latitude": 39.9056,
    "longitude": 116.3958,
    "img": "images/us.jpg",
    "nurseries": 12,
    "id": 8
  },
  {
    "title": "New Delhi",
    "latitude": 28.6353,
    "longitude": 77.225,
    "img": "images/us.jpg",
    "nurseries": 13,
    "id": 9
  },
  {
    "title": "Tokyo",
    "latitude": 35.6785,
    "longitude": 139.6823,
   	"img": "images/us.jpg",
    "nurseries": 14,
    "id": 10
  },
  {
    "title": "Ankara",
    "latitude": 39.9439,
    "longitude": 32.856,
    "img": "images/us.jpg",
    "nurseries": 15,
    "id": 11
  },
  {
    "title": "Buenos Aires",
    "latitude": -34.6118,
    "longitude": -58.4173,
    "img": "images/us.jpg",
    "nurseries": 16,
    "id": 12
  },
  {
    "title": "Brasilia",
    "latitude": -15.7801,
    "longitude": -47.9292,
    "img": "images/us.jpg",
    "nurseries": 17,
    "id": 13
  },
  {
    "title": "Ottawa",
    "latitude": 45.4235,
    "longitude": -75.6979,
    "img": "images/us.jpg",
    "nurseries": 18,
    "id": 14
  },
  {
    "title": "Washington",
    "latitude": 38.8921,
    "longitude": -77.0241,
    "img": "images/us.jpg",
    "nurseries": 19,
    "id": 15
  },
  {
    "title": "Kinshasa",
    "latitude": -4.3369,
    "longitude": 15.3271,
    "img": "images/us.jpg",
    "nurseries": 20,
    "id": 16
  },
  {
    "title": "Cairo",
    "latitude": 30.0571,
    "longitude": 31.2272,
    "img": "images/us.jpg",
    "nurseries": 21,
    "id": 17
  },
  {
    "title": "Pretoria",
    "latitude": -25.7463,
    "longitude": 28.1876,
    "img": "images/us.jpg",
    "nurseries": 22,
    "id": 18
  }
]

// add events to recalculate map position when the map is moved or zoomed
chartNur.events.on( "ready", updateCustomMarkers );
chartNur.events.on( "mappositionchanged", updateCustomMarkers );

// this function will take current images on the map and create HTML elements for them
function updateCustomMarkers( event ) {
  
  // go through all of the images
  imageSeries.mapImages.each(function(image) {
    // check if it has corresponding HTML element
    if (!image.dummyData || !image.dummyData.externalElement) {
      // create onex
      image.dummyData = {
        externalElement: createCustomMarker(image)
      };
    }

    // reposition the element accoridng to coordinates
    var xy = chart.geoPointToSVG( { longitude: image.longitude, latitude: image.latitude } );
    image.dummyData.externalElement.style.top = xy.y + 'px';
    image.dummyData.externalElement.style.left = xy.x + 'px';
    image.dummyData.externalElement.onclick = () => {
    	
    	$('#tooltipContentNur').css({'left': (xy.x - 75) + 'px', 'top': (xy.y + 80) + 'px', 'display': 'block'});
    	const fieldData = imageSeries.data.find(fData => fData.title === image.dummyData.externalElement.title);
    	if (fieldData) {
    		$('#tooltipContentNur').html(`
    			<div class="row">
    				<div class="col-sm-12">
    					<div class="card profile-card-with-cover">
			                <div class="card-content">
			                    <div class="card-img-top img-fluid bg-cover height-80" style="background: #9499a8;color: #fff;text-align: center;font-size: 20px; padding-top: 7px;font-weight: 500;">
			                    	<h2 class="text-center text-white">${fieldData.title}</h2>
			                    </div>
			                    <div class="card-profile-image">
			                        <img src="${fieldData.img}" class="rounded-circle img-border box-shadow-1" alt="country image" style="height:100px;width:100px;">
			                    </div>
			                    <div class="profile-card-with-cover-content text-center">
			                        <div class="profile-details mt-1">
			                            
			                            <ul class="list-inline clearfix mt-1">
			                                <li class="mr-2"><h4 class="block">Latitude</h4> ${fieldData.latitude}</li>
			                                <li class="mr-2"><h4 class="block">Longitude</h4> ${fieldData.longitude}</li>
			                                <li><h4 class="block">Nurseries</h4> ${fieldData.nurseries}</li>
			                            </ul>
			                        </div>
			                    </div>
			                </div>
			            </div>
    				</div>
    			</div>
	    		
    		`);
    	}
    	image.dummyData.externalElement.onmouseout = () => {
	  	$('#tooltipContentNur').css('display', 'none');
	  }
    }
    
  });
}

/*<span class="img-height"><img src="${fieldData.img}"/ style="height:120px;text-align:center;"></span>  <br/>
	    		<span class="color-style">Loation Name : </span> ${fieldData.title} <br> 
	    		<span class="color-style">Latitude : </span> ${fieldData.latitude} <br>
	    		<span class="color-style">Longitude  : </span> ${fieldData.longitude} <br>
	    		<span class="color-style">Trails  : </span> ${fieldData.trails}
	    		<h4 class="card-title">Linda Holland</h4>*/

// this function creates and returns a new marker element
function createCustomMarker( image ) {
  
  var chartImg = image.dataItem.component.chart;

  // create holder
  var holder = document.createElement( 'div' );
  holder.className = 'map-marker';
  holder.title = image.dataItem.dataContext.title;
  holder.style.position = 'absolute';

  // maybe add a link to it?
  if ( undefined != image.url ) {
    holder.onclick = function() {
      window.location.href = image.url;
    };
    holder.className += ' map-clickable';
  }

  // create dot
  var dot = document.createElement( 'div' );
  dot.className = 'dot';
  holder.appendChild( dot );

  // create pulse
  var pulse = document.createElement( 'div' );
  pulse.className = 'pulse';
  holder.appendChild( pulse );

  // append the marker to the map container
  chartImg.svgContainer.htmlElement.appendChild( holder );

  return holder;
}

}); // end am4core.ready()