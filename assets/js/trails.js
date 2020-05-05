
    var villages = [{
        name: "Burkina Faso",
        trails: 5,
        lat: 12.238333,
        lang: -1.561593,
        img: 'images/4.jpg' 
      },
      {
        name: "Benin",
        trails: 5,
        lat: 9.30769,
        lang: 2.315834,
        img: 'images/4.jpg'
      },
      {
        name: "Andorra",
        trails: 5,
        lat: 42.546245,
        lang: 1.601554,
        img: 'images/4.jpg'
      },
      {
        name: "United Arab Emirates",
        trails: 5,
        lat: 23.424076,
        lang: 53.847818,
        img: 'images/4.jpg'
      },
      {
        name: "Afghanistan",
        trails: 5,
        lat: 33.93911,
        lang: 67.709953,
        img: 'images/4.jpg'
      },
      {
        name: "Antigua and Barbuda",
        trails: 5,
        lat: 17.060816,
        lang: -61.796428,
        img: 'images/4.jpg'
      },
      {
        name: "Barbados",
        trails: 5,
        lat: 13.193887,
        lang: -59.543198,
        img: 'images/4.jpg'
      },
      {
        name: "Bangladesh",
        trails: 5,
        lat: 23.684994,
        lang: 90.356331,
        img: 'images/4.jpg'
      },
      {
        name: "Belgium",
        trails: 5,
        lat: 50.503887,
        lang: 4.469936,
        img: 'images/4.jpg'
      },
      {
        name: "Togo",
        trails: 5,
        lat: 8.619543,
        lang: 0.824782,
        img: 'images/4.jpg'
      },
      {
        name: "Mali",
        trails: 5,
        lat: 17.570692,
        lang: -3.996166,
        img: 'images/4.jpg'
      },
      {
        name: "Mauritania",
        trails: 5,
        lat: 21.00789,
        lang: -10.940835,
        img: 'images/4.jpg'
      },
      {
        name: "Senegal",
        trails: 5,
        lat: 14.497401,
        lang: -14.452362,
        img: 'images/4.jpg'
      },
      {
        name: "Liberia",
        trails: 5,
        lat: 6.428055,
        lang: -9.429499,
        img: 'images/4.jpg'
      },
      {
        name: "Ghana",
        trails: 5,
        lat: 7.946527,
        lang: -1.023194,
        img: 'images/4.jpg'
      },
      {
        name: "Cameroon",
        trails: 5,
        lat: 7.369722,
        lang: 12.354722,
        img: 'images/4.jpg'
      },
      {
        name: "Sierra Leone",
        trails: 5,
        lat: 8.460555,
        lang: -11.779889,
        img: 'images/4.jpg'
      },
      {
        name: "Niger",
        trails: 5,
        lat: 17.607789,
        lang: 8.081666,
        img: 'images/4.jpg'
      },
      {
        name: "Chad",
        trails: 5,
        lat: 15.454166,
        lang: 18.732207,
        img: 'images/4.jpg'
      },
      {
        name: "Cameroon",
        trails: 5,
        lat: 7.369722,
        lang: 12.354722,
        img: 'images/4.jpg'
      },
      {
        name: "Ethiopia",
        trails: 5,
        lat: 9.145,
        lang: 40.489673,
        img: 'images/4.jpg'
      },
      {
        name: "Nigeria",
        trails: 5,
        lat: 9.081999,
        lang: 8.675277,
        img: 'images/4.jpg'
      },
      {
        name: " MARURU",
        trails: 5,
        lat: 14.6176,
        lang: 77.6060,
        img: 'images/4.jpg'
      },
      {
        name: " Setturu",
        trails: 5,
        lat: 14.4474,
        lang: 76.9830,
        img: 'images/4.jpg'
      },
      {
        name: "Beluguppa",
        trails: 5,
        lat: 14.7143,
        lang: 77.1341,
        img: 'images/4.jpg'
      },
      {
        name: "Kundurpi",
        trails: 5,
        lat: 14.2879,
        lang: 77.0377,
        img: 'images/4.jpg'
      },
      {
        name: "Kalyanadugam",
        trails: 5,
        lat: 14.5506,
        lang: 77.1087,
        img: 'images/4.jpg'
      }
    ]
    var map = L.map('trails').setView([12.238333, -1.561593], 8);
    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    //   maxZoom: 5,
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    //     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //     'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   id: 'mapbox/streets-v11'
    // }).addTo(map);


    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
       maxZoom: 5,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(map);


    var markers = L.markerClusterGroup();
    for (var i = 0; i < villages.length; i++) {
      var name = villages[i]['name'];
      var lat = villages[i]['lat'];
      var lng = villages[i]['lang'];
      var trails = villages[i]['trails'];
      var img = villages[i]['img'];

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
                                      <li class=""><h3 class="block font-18">Study Type</h3> Trial</li>
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
    map.addLayer(markers);
    var popup = L.popup();
    setTimeout(ale => {
       $('.leaflet-marker-icon').attr('src','./images/pin1.png');
    }, 1000);
  





    /*<span class="img-height"><img src="${img}"/ style="height:105px;"></span>  <br/>
        <span class="color-name"> Name : </span> ${name} <br/>
        <span class="color-name"> Latitude : </span> ${lat} <br/>
        <span class="color-name"> Longitude : </span> ${lng} <br/>
        
        <span class="color-name"> Trails : </span> ${trails} <br/>*/