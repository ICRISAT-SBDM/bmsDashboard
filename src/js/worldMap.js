const map = L.map('mapid').setView([20.5937, 78.9629], 4);
let cluster = null;
// map.addLayer(cluster);
    
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
 }).addTo(map);

 const generateMapMarkerToolTip = (param) => {
    const mapData = !param ? selectedTrail.filter(data => data.latitude && data.longitude)
    : allTrailsList.filter(data => data.latitude && data.longitude && data.locationCountry === param);
    
    if (cluster) {
        map.removeLayer(cluster)
    } else {
        cluster = L.markerClusterGroup();
    }
    let lastLatLong = null;
    mapData.forEach(data => {
        const nursaryColor = `background-color:Tomato; color: white;padding: 15px;`;
        const trailColor = `background-color:DodgerBlue; color: white;padding: 15px;`
        const marker = L.marker([data.latitude, data.longitude])
        marker.bindPopup(`
        <div style="${data.studyType === 'Trial' ? trailColor : nursaryColor}">
        Location : ${data.locationCountry}<br>
        Study Name: ${data.studyName}<br>
        Trail Name: ${data.trailName ? data.trailName : ''}<br>
        Crop: ${data.crop}<br>
        Date: ${dateFormat(data.startDate)}<br>
        Latitude: ${data.latitude}.<br>
        Longitude: ${data.longitude}
        </div>
        `)
        cluster.addLayer(marker);
        lastLatLong = [data.latitude, data.longitude];
    });
    map.addLayer(cluster);
    if (lastLatLong) map.setView(lastLatLong, 6);
}

const dateFormat = (data) => {
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (data && data.length === 8) {
        const day = data.substring(6,8);
        const month = monthName[parseInt(data.substring(4,6)) - 1];
        const year = data.substring(0,4);
        return `${day}-${month}-${year}`;
    }
}