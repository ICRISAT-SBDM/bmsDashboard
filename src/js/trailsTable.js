generateCropTableOverProgram = () => {
    const tbData = [];
    all_crops.forEach(data => {
    const allProgram = Array.from(new Set(all_trials.filter(fData => fData.crop === data).map(mData => mData.program)));
    const programData = [];
    allProgram.forEach(pData => {
    const nursary = all_trials.filter(ndata => ndata.studyType === 'Nursery' && ndata.program === pData && ndata.crop === data).length;
    const trail = all_trials.filter(tdata => tdata.studyType === 'Trial' && tdata.program === pData && tdata.crop === data).length;
    if (nursary || trail) {
    programData.push({'crop': data, 'program': pData, 'noOfTrails': trail, 'noOfNursary': nursary});
    }
    
    });
    recordData = {'crop': data, 'program': programData};
    tbData.push(recordData);
    });
    let cropTableHtml = '';
    tbData.forEach(data => {
        if (data && data.program && data.program.length) {
            cropTableHtml +=  `<tr>
            <td rowspan="${data.program.length}">${data.crop}</td>`;
            data.program.forEach(fData => {
            cropTableHtml +=  `<td>${fData.program}</td>
            <td>${fData.noOfTrails}</td>
            <td>${fData.noOfNursary}</td>
            </tr>
            `;
            });
        }
    });
    $('#cropTableTBody').html(cropTableHtml);
    }



    const generateProgramTableData = (cropProgramData) => {
      const tableData = [];
      let tableHtml = `<table class="table table-bordered table-hover">
      <thead>
        <tr class="bg-nur text-white">
          <th>Crop Name</th>
          <th>Program </th>
          <th>Trials </th>
          <th>Nurseries</th>
        </tr>
      </thead>
      <tbody>`;
  
      Array.from(new Set(cropProgramData.map(data => data.crop))).forEach(data => {
          if(data){
              const subData = [];
              const record = {'crop': data};
              const programData = Array.from(new Set(cropProgramData.filter(cData => cData.crop).map(cData => cData.program)));
              programData.forEach(prgData => {
                  const trial = cropProgramData.filter(prData => prData.crop === data && prData.program === prgData && prData.studyType && prData.studyType === "Trial").length;
                  const nursery = cropProgramData.filter(prData => prData.crop === data && prData.program === prgData && prData.studyType && prData.studyType === "Nursery").length;
                  subData.push({'program': prgData, 'trial': trial, 'nursery': nursery})
              });
              record['data'] = subData;
              tableData.push(record);
          }
      });
  
      tableData.forEach(data => {
          const subData = data.data.filter(fData => fData.trial || fData.nursery);
          if (subData && subData.length > 0){
              subData.forEach((cData, index) => {
                  if(index === 0){
                      tableHtml += `
                          <tr>
                              <td rowspan="${subData.length}">${data.crop}</td>
                              <td>${cData.program}</td>
                              <td>${cData.trial}</td>
                              <td>${cData.nursery}</td>
                          </tr>
                      `;
                  }
                  if(index > 0){
                      tableHtml += `
                          <tr>
                              <td>${cData.program}</td>
                              <td>${cData.trial}</td>
                              <td>${cData.nursery}</td>
                          </tr>
                      `;
                  }
              });
          }
      });
      
      tableHtml += `</tbody>
      </table>`;
      $('#programsTable').html(tableHtml);
      return {'tableData': tableData, 'tableHtml': tableHtml};
  }

  
/************************************************** Trails Table  ************************************************************************ */

const onRowClick = (country, crop) => {
    if (country) {
        //    const countryRecord = allTrailsList.find(detail => detail.locationCountry.toLowerCase() === country.toLowerCase())
        // if (countryRecord) {
            if (map) {
                generateMapMarkerToolTip(country)
              closeNav();
            }
        // }
    }
  }
  
  const generateTableData = (nurTrailData) => {
    const tableData = [];
    let tableHtml = `<table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="bg-primary text-white">
    <th>LOCATIONS</th>
    <th>CROPS</th>
    <th>NURSERIES</th>
    <th>TRIALS</th>
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
    <tr onclick="onRowClick('${data.country}', '${data.crop}')">
    <td rowspan="${subData.length}"><strong style="color: red;cursor:pointer">${data.country}</strong></td>
    <td>${cData.crop}</td>
    <td>${cData.trail}</td>
    <td>${cData.nursary}</td>
    </tr>`;	
    }
    if (index > 0) {
    tableHtml += `
    <tr onclick="onRowClick('${data.country}', '${data.crop}')">
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
    $('#trailsTable').html(tableHtml);
    return {'tableData': tableData, 'tableHtml': tableHtml};
    }