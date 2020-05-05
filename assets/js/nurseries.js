
    var villmap = null;
    var country = [{
        name: "Burkina Faso",
        nurseries: 10,
        lat: 12.238333,
        lang: -1.561593,
        img: 'images/4.jpg' 
      },
      {
        name: "Benin",
        nurseries: 10,
        lat: 9.30769,
        lang: 2.315834,
        img: 'images/4.jpg'
      },
      {
        name: "Togo",
        nurseries: 10,
        lat: 8.619543,
        lang: 0.824782,
        img: 'images/4.jpg'
      },
      {
        name: "Mali",
        nurseries: 10,
        lat: 17.570692,
        lang: -3.996166,
        img: 'images/4.jpg'
      },
      {
        name: "Niger",
        nurseries: 10,
        lat: 17.607789,
        lang: 8.081666,
        img: 'images/4.jpg'
      },
      {
        name: "Chad",
        nurseries: 10,
        lat: 15.454166,
        lang: 18.732207,
        img: 'images/4.jpg'
      },
      {
        name: "Cameroon",
        nurseries: 10,
        lat: 7.369722,
        lang: 12.354722,
        img: 'images/4.jpg'
      },
      {
        name: "Ethiopia",
        nurseries: 10,
        lat: 9.145,
        lang: 40.489673,
        img: 'images/4.jpg'
      },
      {
        name: "Nigeria",
        nurseries: 10,
        lat: 9.081999,
        lang: 8.675277,
        img: 'images/4.jpg'
      },
      
      {
        name: " MARURU",
        nurseries: 10,
        lat: 14.6176,
        lang: 77.6060,
        img: 'images/4.jpg'
      },
      {
        name: " Setturu",
        nurseries: 10,
        lat: 14.4474,
        lang: 76.9830,
        img: 'images/4.jpg'
      },
      {
        name: "Beluguppa",
        nurseries: 10,
        lat: 14.7143,
        lang: 77.1341,
        img: 'images/4.jpg'
      },
      {
        name: "Kundurpi",
        nurseries: 10,
        lat: 14.2879,
        lang: 77.0377,
        img: 'images/4.jpg'
      },
      {
        name: "Kalyanadugam",
        nurseries: 10,
        lat: 14.5506,
        lang: 77.1087,
        img: 'images/4.jpg'
      }
    ]
    

    const showMap = () => {
      if (!villmap) {
      setTimeout(ele => {
        villmap = L.map('map').setView([12.238333, -1.561593], 8);
   /* L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 5,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11'
    }).addTo(villmap);*/

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
       maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(villmap);

    var markers = L.markerClusterGroup();
    for (var i = 0; i < country.length; i++) {
      var name = country[i]['name'];
      var lat = country[i]['lat'];
      var lng = country[i]['lang'];
      var nurseries = country[i]['nurseries'];
      var img = country[i]['img'];

      var marker = L.marker(new L.LatLng(lat, lng), {
        title: name,
      });
      // name  + " <br>" + 'Nurseries : 10' + "<br>" +'Trails :5' + "<br>" + 'Lat' + "<br>" + 'Lang'
      const html = `

       <div class="row">
            <div class="col-sm-12">
              <div class="card profile-card-with-cover" style="border:none;">
                          <div class="card-img-top img-fluid bg-cover height-80" style="background: #9499a8;color: #fff;text-align: center;font-size: 20px; padding-top: 7px;font-weight: 500;">
                            <h2 class="text-center text-white font-20">Study Name</h2>
                          </div>
                          <div class="card-profile-image">
                              <img src="${img}" class="rounded-circle img-border box-shadow-1" alt="country image" style="height:100px;width:100px;">
                          </div>
                          <div class="profile-card-with-cover-content text-center">
                              <div class="profile-details mt-2">
                              <h3 class="text-center font-20">Crop Name</h3>
                                  <ul class="list-inline clearfix mt-2">
                                      <li class=""><h3 class="block font-18">Study Type</h3> Nurseries</li>
                                      <li class=""><h3 class="block font-18">Locations</h3>India</li>
                                      <li><h3 class="block font-18">Uploaded by: </h3> David Amir </li>
                                  </ul>
                              </div>
                          </div>
                  </div>
            </div>
          </div>
      `;
      marker.bindPopup(html);
      markers.addLayer(marker);
      /* adding click event */
      marker.on('click', function(e) {
        var name = e.target._popup._content;
        var side_info = name  + "Clicked.";

        // adding info into side bar
        $("#centers_info_sidebar").html(side_info);
        $('.leaflet-popup-content').on('click', () => {
          window.location.href="aboutus.html";
        });
      });
    }
    villmap.addLayer(markers);
    var popup = L.popup();
  }, 500);
    }
    }


    $('#base-pillOpt12').on('click', () => {
      showMap();
    });