var all_crops = [];
var all_trials = [];
get('crops').then(cropsResponse => {
    if (cropsResponse && cropsResponse.data && Array.isArray(cropsResponse.data)) {
        all_crops = cropsResponse.data;
        const trialApis = all_crops.map(data => get('trials/?cropName=' + data));
        Promise.all(trialApis).then(trailsData => {
            if (trailsData && Array.isArray(trailsData)) {
                trailsData.map(tData => tData.data).forEach(data => {
                    all_trials.push(...data);
                });
                if (all_trials && all_trials.length > 0) {                        
                    trailNursaryData = generateTableData(all_trials)
                    $('#trailsTable').html(trailNursaryData.tableHtml)
                    const totTrails = all_trials.filter(data => data.studyType && data.studyType === 'Trial');
                    const totNur = all_trials.filter(data => data.studyType && data.studyType === 'Nursery');
                    $('#trail').html(totTrails.length);
                    $('#nursary').html(totNur.length);
                }
            }
        });
    }
});

const generateTableData = (nurTrailData) => {
const tableData = [];
let tableHtml = `<table class="table table-striped table-bordered table-hover">
<thead>
<tr class="bg-nur text-white">
<th>Location</th>
<th>Crop</th>
<th>Nursaries</th>
<th>Trails</th>
</tr>
</thead>
<tbody>
`;

Array.from(new Set(nurTrailData.map(data => data.locationCountry))).forEach(data => {
if (data) {
    const subData = [];
    const record = {'country': data};
    const cropData = Array.from(new Set(nurTrailData.filter(cData => cData.locationCountry).map(cData => cData.crop)));
    cropData.forEach(crpData => {
    const trail = nurTrailData.filter(crData => crData.locationCountry === data && crData.crop === crpData && crData.studyType && crData.studyType === 'Trial').length;
    const nursary = nurTrailData.filter(crData => crData.locationCountry === data && crData.crop === crpData && crData.studyType && crData.studyType === 'Nursery').length;
    subData.push({'crop': crpData, 'trail': trail, 'nursary': nursary})
});
    
    record['data'] = subData;
    tableData.push(record);
}
});
tableData.forEach(data => {

const subData = data.data.filter(fData => fData.trail || fData.nursary);
if (subData && subData.length > 0) {
subData.forEach((cData, index) => {
if (index === 0) {
	tableHtml += `
<tr>
<td rowspan="${subData.length}">${data.country}</td>
<td>${cData.crop}</td>
<td>${cData.trail}</td>
<td>${cData.nursary}</td>
</tr>`;	
}
if (index > 0) {
tableHtml += `
<tr>
<td>${cData.crop}</td>
<td>${cData.trail}</td>
<td>${cData.nursary}</td>
</tr>
`;
}
});
}
});
tableHtml += `</tbody>
</table>`;
return {'tableData': tableData, 'tableHtml': tableHtml};
};
