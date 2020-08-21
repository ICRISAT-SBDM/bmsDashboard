const map = L.map('mapid').setView([20.5937, 78.9629], 3);
let cluster = null;

const setIcon = ((img) => {
    return {
    icon: L.icon({
      iconUrl: img,
      iconSize: [10, 10],
    })
  };
});
const icons = {red: setIcon(`./images/pin3.png`) ,green: setIcon(`./images/pin2.png`), blue: setIcon(`./images/pin1.png`)};

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

const generateMapMarkerToolTip = (param) => {
    let trialType = $(`input[name='map-radio']:checked`).val();
    const isReq = (data, tType) => {
        return (tType === 'all' ||data.experimentalDesignStatus == tType);
    };
    let sType = 'all';
    if ($('#all-trials').prop('checked') && !$('#all-Nurseries').prop('checked')) {
        sType = 'Trial';
    } else if (!$('#all-trials').prop('checked') && $('#all-Nurseries').prop('checked')) {
        sType = 'Nursery';
    } else {
        sType = 'all';
    }
    const reqData = !param 
        ? selectedTrial.filter(data =>data.studyType && data.latitude && data.longitude &&
        isReq(data, trialType) && (sType === 'all' || data.studyType === sType))
        : allTrialsList.filter(data => 
            data.studyType && data.latitude && data.longitude && data.locationCountry === param &&
            isReq(data, trialType) && (sType === 'all' || data.studyType === sType));
    if (cluster) {
        cluster.clearLayers()
        map.removeLayer(cluster)
    } else {
        cluster = L.markerClusterGroup();
    }
    let lastLatLong = null;
    let iconObj = icons.blue;
    reqData.forEach(data => {
        const nurseryColor = `background-color:Tomato; color: white;padding: 15px;`;
        const trialColor = `background-color:DodgerBlue; color: white;padding: 15px;`
        const marker = L.marker([data.latitude, data.longitude], data.iconObj);
        marker.bindPopup(`
        <div style="${data.studyType === 'Trial' ? trialColor : nurseryColor}">
        Location : ${data.locationCountry}<br>
        Study Name: ${data.studyName}<br>
        Trial Name: ${data.trialName ? data.trialName : ''}<br>
        Crop: ${data.crop}<br>
        Date: ${data.startDate}<br>
        Latitude: ${data.latitude}.<br>
        Longitude: ${data.longitude}
        </div>
        `)
        cluster.addLayer(marker);
        lastLatLong = [data.latitude, data.longitude];
    });
    map.addLayer(cluster);
    if (lastLatLong) map.setView(lastLatLong, 3);
}

const dateFormat = (data) => {
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (data && data.length === 8) {
        const day = data.substring(6, 8);
        const month = monthName[parseInt(data.substring(4, 6)) - 1];
        const year = data.substring(0, 4);
        return `${day}-${month}-${year}`;
    }
}
