generateCropTableOverProgram = () => {
    const tbData = [];
    all_crops.forEach(data => {
    const allProgram = Array.from(new Set(all_trials.filter(fData => fData.crop === data).map(mData => mData.program)));
    const programData = [];
    allProgram.forEach(pData => {
    const nursery = all_trials.filter(ndata => ndata.studyType === 'Nursery' && ndata.program === pData && ndata.crop === data).length;
    const trial = all_trials.filter(tdata => tdata.studyType === 'Trial' && tdata.program === pData && tdata.crop === data).length;
    if (nursery || trial) {
    programData.push({'crop': data, 'program': pData, 'noOfTrials': trial, 'noOfNursery': nursery});
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
            <td>${fData.noOfTrials}</td>
            <td>${fData.noOfNursery}</td>
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

  
/************************************************** Trials Table  ************************************************************************ */

const onRowClick = (country, crop) => {
    if (country) {
        clearAll();
        const continentsVal = continentList.map(data => data.continent)
        $('#Continent').val(continentsVal)
        $('#all-continent').prop('checked', true);
        getContriesByContinent();
        getCropsHtmlList();
        getYearList();
        getAllDesignList ();
        if (crop) $('#Crop').val([crop]);
        $('#Countries').val([country]);
        $('#Continent, #Countries, #Crop, #Years, #designs, #program, #studyName').fSelect('reload');
        getSelectedTrials();
        closeNav();
    }
  }


  const onReset = () => {
    const continentsVal = continentList.map(data => data.continent)
    $('#Continent').val(continentsVal);
    $('#Continent').trigger('change');
    $('#Continent, #Countries, #Crop, #Years, #designs, #program, #studyName').fSelect('reload');
    closeNav();
  }
  
  const generateTableData = (nurTrialData) => {
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
    
    Array.from(new Set(nurTrialData.map(data => data.locationCountry))).forEach(data => {
    if (data) {
        const subData = [];
        const record = {'country': data};
        const cropData = Array.from(new Set(nurTrialData.filter(cData => cData.locationCountry).map(cData => cData.crop)));
        cropData.forEach(crpData => {
        const trial = nurTrialData.filter(crData => crData.locationCountry === data && crData.crop === crpData && crData.studyType && crData.studyType === 'Trial').length;
        const nursery = nurTrialData.filter(crData => crData.locationCountry === data && crData.crop === crpData && crData.studyType && crData.studyType === 'Nursery').length;
        subData.push({'crop': crpData, 'trial': trial, 'nursery': nursery})
    });
        
        record['data'] = subData;
        tableData.push(record);
    }
    });
    tableData.forEach(data => {
    
    const subData = data.data.filter(fData => fData.trial || fData.nursery);
    if (subData && subData.length > 0) {
    subData.forEach((cData, index) => {
    if (index === 0) {
      tableHtml += `
    <tr>
    <td onclick="onRowClick('${data.country}', '')"><strong style="color: red;cursor:pointer">${data.country}</strong></td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.crop}</td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.trial}</td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.nursery}</td>
    </tr>`;	
    }
    if (index > 0) {
    tableHtml += `
    <tr>
	<td onclick="onRowClick('${data.country}', '')"></td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.crop}</td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.trial}</td>
    <td onclick="onRowClick('${data.country}', '${cData.crop}')">${cData.nursery}</td>
    </tr>
    `;
    }
    });
    }
    });
    tableHtml += `</tbody>
    </table>`;
    $('#trialsTable').html(tableHtml);
    return {'tableData': tableData, 'tableHtml': tableHtml};
    }