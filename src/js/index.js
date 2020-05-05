let countryList = [];
let cropList = [];
let continentList = [];
let allTrailsList = [];
let selectedTrail = [];
let yearList = [];
let traitsData = [];
let designList = [];
window.fs_test = $('#Continent, #Countries, #Crop, #Years, #program, #studyName, #designs').fSelect();
$('#Continent').val([]);
Promise.all([get('countries'), get('crops')]).then(response => {
  if (response && response.length) {
    if (response[0] && response[0].data) {
      countryList = response[0].data;
      // continents are assigned.
      countryList.forEach(element => {
        if (element.countryName === 'India') {
          element.continent = 'Asia';
        } else {
          element.continent = 'Africa';
        }
      });
      getContinentHtmlList();
      getContriesByContinent();
    }
    if (response[1] && response[1].data) {
      cropList = response[1].data;
      getCropsHtmlList();
      getTrailApi();
    }
  }
});

/**
 * To get Program Api Data
 */

const getTrailApi = () => {
  const cropVal = $('#Crop').val();
  const trailApi = cropList.map(data => get(`trials/?cropName=${data}`));
  Promise.all(trailApi).then(response => {
    if(response && response.length) {
      const responses = [];
      response.forEach(element => responses.push(...element.data));
      responses.forEach(element => {
        if (!element.latitude || !element.longitude) {
          const country = countryList.find(fdata => fdata.countryName === element.locationCountry);
          if (country) {
            element.latitude = country.latitude;
            element.longitude = country.longitude;
          }
        }
      });
      allTrailsList = responses;
      generateTableData(allTrailsList);
      getYearList();
      getSelectedTrails();
      getAllDesignList();
    }
  });
}

/*
 * To get continent option list and show number of continent avaliable.
 */
const getContinentHtmlList = () => {
  continentList = Array.from(new Set(countryList.map(element => element.continent)));
  $('#Continent').html('');
  $('#Continent').fSelect('reload');
  $('#numOfContinent').text(continentList.length);
  let continentHtml = `
  <option value="" selected="selected"> Select Continent </option> \n`;
  continentHtml += continentList.map(data => `<option value="${data}">${data}</option>`).join('\n');
  $('#Continent').html(continentHtml);
  $('#Continent').fSelect('reload');
}

/**
 * To get crops html option list and show number of crops avaliable.
 */
const getCropsHtmlList = () => {
  $('#numOfCrops').text(cropList.length);
  let cropsHtml = `<option value="" selected="selected"> Select Crop </option>\n`;
  cropsHtml += cropList.map(data => `<option value="${data}">${data}</option>`).join('\n');
  $('#Crop').html(cropsHtml);
  $('#Crop').fSelect('reload');
}

/**
 * To get list of contries by continent.
 */
const getContriesByContinent = () => {
  const val = $('#Continent').val();
  const continent =  val && Array.isArray(val) ? val.filter(data => data) : [];
  const conuntries = countryList.filter(data => !continent || continent.length === 0 || continent.includes(data.continent));
  $('#numOfCountry').text(conuntries.length);
  let countryHtml = `
  <option value="" selected="selected"> Select Countries </option> \n`;
  countryHtml += conuntries.map(data => `<option value="${data.countryName}">${data.countryName}</option>`).join('\n');
  $('#Countries').html(countryHtml);
  $('#Countries').fSelect('reload');
}

/**
 * To get list of Years.
 */
const getYearList = () => {
  $('#numOfYears').text('0');
  $('#Years').html('');
  $('#Years').fSelect('reload');
  yearList = Array.from(new Set(allTrailsList.filter(data => data.startDate)
    .map(data => parseInt(data.startDate.substring(0, 4))))).sort((d1, d2) => d1 - d2).map(data => data.toString());
  $('#numOfYears').text(yearList.length);
  if (yearList && yearList.length) {
    let yearHtml = `<option value="" selected="selected"> Select Years </option> \n`;
    yearHtml += yearList.map(data => `<option value="${data}">${data}</option>`).join('\n');
    $('#Years').html(yearHtml);
    $('#Years').fSelect('reload');
  }
}

/**
 * To get list of Program by selected filter.
 */
const getProgramList = () => {
  $('#program').html('');
  $('#program').val([]);
  $('#program').fSelect('reload');
  let programHtml = '<option value="" selected="selected"> Select Program </option>';
  const programList = Array.from(new Set(selectedTrail.filter(data => data.program).map(data => data.program))).map(data => `
  <option value="${data}">${data}</option>`).join('\n');
  if (programList) {
    programHtml += programList;
  }
  $('#program').html(programHtml);
  $('#program').fSelect('reload');
}
/**
 * To get list of Study Names by  Program.
 */
const getStudyNameList = () => {
  $('#studyName').html('');
  $('#studyName').val([]);
  $('#studyName').fSelect('reload');
  let studyNameHtml = '<option value="" selected="selected"> Select Study Name </option>';
  const programVal = getFieldValue($('#program').val());
  if (programVal) {
    const studyNameList = Array.from(new Set(selectedTrail.filter(data => data.studyName && programVal.includes(data.program)).map(data => data.studyName)))
    .map(data => ` <option value="${data}">${data}</option>`).join('\n');
    if (studyNameList) {
      studyNameHtml += studyNameList;
    }
    $('#studyName').html(studyNameHtml);
    $('#studyName').fSelect('reload');
  }
  }

  /**
 * To get list of Trails Names by Study Name.
 */
const getTrailsNameList = () => {
  $('#allTrailsName').html('');
  const studyNameVal = getFieldValue($('#studyName').val());
  if(studyNameVal) {
    const trailNameList = Array.from(new Set(selectedTrail.filter(data => (data.trialName || data.trialName === false) && studyNameVal.includes(data.studyName)).map(data => data.trialName)))
    .map(data => {
      const record = selectedTrail.find(fdata => fdata.trialName === data && studyNameVal.includes(fdata.studyName));
      return `<a onclick="onTrailClick('${record.crop}', '${record.trialDbId}')" class="list-group-item list-group-item-action">${data}</a>`}).join('\n');
    if (trailNameList) {
      $('#allTrailsName').html(trailNameList);
    }
  }
}

const getAllDesignList = () => {
  $('#numofdesign').text('0');
  $('#designs').html('');
  $('#designs').fSelect('reload');
  designList = Array.from(new Set(allTrailsList.filter(data => data.experimentaldesign).map(data => data.experimentaldesign)));;
  $('#numofdesign').text(designList.length);
  if (designList && designList.length) {
    let yearHtml = `<option value="" selected="selected"> Select Designs </option> \n`;
    yearHtml += designList.map(data => `<option value="${data}">${data}</option>`).join('\n');
    $('#designs').html(yearHtml);
    $('#designs').fSelect('reload');
  }
}

/*
 * To get Field Array Value
*/
const getFieldValue = (val) => {
  return val && Array.isArray(val) ? val.filter(data => data) : []
}

/**
 * To Variefy Empty Field
 */
const isEmptyField = (val) => {
  return !val || !Array.isArray(val) || val.length === 0 || val.filter(data => data).length === 0;
}

/**
 * To get selected trails
 */
getSelectedTrails = () => {
  $('#numOfTrails').text('0');
  $('#numOfNursary').text('0');
  $('#program').val([]);
  $('#program').html('');
  $('#program').fSelect('reload');
  $('#studyName').val([]);
  $('#studyName').html('');
  $('#program').fSelect('reload');
  $('#traitNames').html('');
  $('#traitsTBody').html('');
  $('#allTrailsName').html('');
  $('#programsTable').html('');
  disponseTrailNursaryChart();
  disponsereplicationgraph();
  if (cluster) cluster.clearLayers();

  const conuntryVal = getFieldValue($('#Countries').val());
  const cropVal = getFieldValue($('#Crop').val());
  const yearVal = getFieldValue($('#Years').val());
  const designVal = getFieldValue($('#designs').val());

  selectedTrail = allTrailsList.filter(data => (isEmptyField(conuntryVal) || conuntryVal.includes(data.locationCountry))
  && (isEmptyField(cropVal) || cropVal.includes(data.crop)) && (isEmptyField(yearVal) || yearVal.includes(data.startDate.substring(0,4)))
  && (isEmptyField(designVal) || designVal.includes(data.experimentaldesign)));
  if (selectedTrail && selectedTrail.length) {
    const trails = selectedTrail.filter(data => data.studyType === 'Trial');
    const nursaries =  selectedTrail.filter(data => data.studyType === 'Nursery');
    $('#numOfTrails').text(trails.length);
    $('#numOfNursary').text(nursaries.length);
    setTimeout(() => { generateTrialCountsChart()});
    setTimeout(() => { generateNurserieslCountsChart()});
    setTimeout(() => { generateNurTrialChartVertical()});
    setTimeout(() => { generateCountryTrialsChart()});
    setTimeout(() => { generateCountryNurseriesChart()});
    setTimeout(() => { generateProgramTableData(selectedTrail)});
    setTimeout(() => { generateMapMarkerToolTip(false)});
    setTimeout(() => { getProgramList()});
  }
}

const onTrailClick = (crop, trailNo) => {
  get(`traits/?cropName=${crop}&studyDbId=${trailNo}`).then(response => {
    if (response && response.data) {
      traitsData = response.data;
      if (traitsData) {
        const traitHtml = traitsData.filter(data => data.triatName).map(data => 
          `<a class="list-group-item list-group-item-action"> ${data.triatName}</a>`).join('\n');
        const tBodyHtml = traitsData.filter(data => data.triatName).map(data => 
            `<tr>
            <td> ${data.triatName} </td>
            <td> 
              <div class="cell">
                <span style="width:100%" data-value="100">${data.min}%</span>
                <progress max="100" value="${data.min}" class="">
                  <div class="progress-bar">
                    <span style="width: 100%">${data.min}%</span>
                  </div>
                </progress>
              </div>
            </td>

            <td>
              <div class="cell">
                <span style="width:100%" data-value="100">${data.mean}%</span>
                <progress max="100" value="${data.mean}" class="">
                  <div class="progress-bar">
                    <span style="width: 100%">${data.mean}%</span>
                  </div>
                </progress>
              </div>
            </td>

            <td>
               <div class="cell">
                <span style="width:100%" data-value="100">${data.max}%</span>
                <progress max="100" value="${data.max}" class="">
                  <div class="progress-bar">
                    <span style="width: 100%">${data.max}%</span>
                  </div>
                </progress>
              </div>
            </td>
          </tr>`).join('\n');
          $('#traitNames').html(traitHtml);
          $('#traitsTBody').html(tBodyHtml);
      }
    }
  });
}


/*
 * Event fired when Continent value changed.
 */
$('#Continent').on('change', () => {
  $('#numOfCountry').text('0');
  $('#Countries').html('');
  $('#Countries').fSelect('reload');
  getContriesByContinent();
});

/*
 * Event fired when Crop value changed.
 */
$('#Crop').on('change', () => {
  getSelectedTrails();
});

/*
 * Event fired when Country value changed.
 */
$('#Countries').on('change', () => {
  getSelectedTrails();
});

/*
 * Event fired when Year value changed.
 */
$('#Years').on('change', () => {
  getSelectedTrails();
});

/*
 * Event fired when Year value changed.
 */
$('#designs').on('change', () => {
  getSelectedTrails();
});

/*
 * Event fired when Program value changed.
 */
$('#program').on('change', () => {
  getStudyNameList();
});

$('#studyName').on('change', () => {
  getTrailsNameList();
});

/**
 * Event fired when select all continent change
 */
$('#all-continent').on('change', () => {
 const selectVal = $('#all-continent').prop('checked');
 $('#Continent option').prop('selected', selectVal);
 $('#Continent').fSelect('reload');
 $('#Continent').trigger('change');
});

/**
 * Event fired when select all countries change
 */
$('#all-contries').on('change', () => {
  const selectVal = $('#all-contries').prop('checked');
  $('#Countries option').prop('selected', selectVal);
  $('#Countries').fSelect('reload');
  $('#Countries').trigger('change');
 });

 /**
 * Event fired when select all crops change
 */
$('#all-crops').on('change', () => {
  const selectVal = $('#all-crops').prop('checked');
  $('#Crop option').prop('selected', selectVal);
  $('#Crop').fSelect('reload');
  $('#Crop').trigger('change');
 });

 /**
 * Event fired when select all years change
 */
$('#all-years').on('change', () => {
  const selectVal = $('#all-years').prop('checked');
  $('#Years option').prop('selected', selectVal);
  $('#Years').fSelect('reload');
  $('#Years').trigger('change');
 });

 /**
 * Event fired when select all programs change
 */
$('#all-programs').on('change', () => {
  const selectVal = $('#all-programs').prop('checked');
  $('#program option').prop('selected', selectVal);
  $('#program').fSelect('reload');
  $('#program').trigger('change');
 });

  /**
 * Event fired when select all study names change
 */
$('#all-studyNames').on('change', () => {
  const selectVal = $('#all-studyNames').prop('checked');
  $('#studyName option').prop('selected', selectVal);
  $('#studyName').fSelect('reload');
  $('#studyName').trigger('change');
 });

 /**
 * Event fired when select all design change
 */
$('#all-designs').on('change', () => {
  const selectVal = $('#all-designs').prop('checked');
  $('#designs option').prop('selected', selectVal);
  $('#designs').fSelect('reload');
  $('#designs').trigger('change');
 });
