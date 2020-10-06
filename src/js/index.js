let countryList = [];
let cropList = [];
let continentList = [];
let allTrialsList = [];
let selectedTrial = [];
let yearList = [];
let traitsData = [];
let designList = [];
window.fs_test = $('#Continent, #Countries, #Crop, #Years, #program, #studyName, #designs').fSelect();
$('#Continent').val([]);
$('.radio-selected').css({ 'background-color': '#14b825' });
Promise.all([get('countries'), get('crops')]).then(response => {
  if (response && response.length) {
    if (response[0] && response[0].data) {
      countryList = response[0].data;
      getContinentHtmlList();
      getContriesByContinent();
    }
    if (response[1] && response[1].data) {
      cropList = response[1].data;
      getTrialApi();
    }
  }
});

/**
 * To get Program Api Data
 */

const getTrialApi = () => {
  get(`trials/?cropName=all`).then(response => {
    if (response && response.data && response.data.length) {
      allTrialsList = response.data;
      fillMissingCountryDetails();
      arrangeCropCountryDesign();
      allTrialsList.forEach(resObj => {
        if (resObj.studyType === 'Trial' && resObj.experimentalDesignStatus === 'Advanced') {
          resObj.iconObj = icons.blue;
          resObj.popupClass = 'advanced-trials-popup';
        } else if (resObj.studyType === 'Nursery') {
          resObj.iconObj = icons.green;
          resObj.popupClass = 'nursery-popup';
        } else if (resObj.studyType === 'Trial' && resObj.experimentalDesignStatus === 'Primitive') {
          resObj.iconObj = icons.red;
          resObj.popupClass = 'primitive-trials-popup';
        }
      })

      getCropsHtmlList();
      generateTableData(allTrialsList);
      getYearList();
      getAllDesignList();
      getSelectedTrials();
    }
  });
}

/*
 * To get continent option list and show number of continent avaliable.
 */
const getContinentHtmlList = () => {
  continentList = Array.from(new Set(countryList.map(element => element.continent))).map(element => {
    const result = { 'continent': element };
    result['countries'] = countryList.filter(fData => fData.continent === element).map(mData => {
      return {
        'countryName': mData.countryName,
        'latitude': mData.latitude,
        'longitude': mData.longitude
      };
    })
    return result;
  });
  $('#Continent').html('');
  $('#Continent').fSelect('reload');
  $('#numOfContinent').text(continentList.length);
  let continentHtml = `
  <option value="" selected="selected"> Select Continent </option> \n`;
  continentHtml += continentList.map(data => `<option value="${data.continent}">${data.continent}</option>`).join('\n');
  $('#Continent').html(continentHtml);
  $('#all-continent').prop('checked', true);
  $('#Continent option').prop('selected', true);
  $('#Continent').fSelect('reload');
}

/**
 * To get crops html option list and show number of crops avaliable.
 */
const getCropsHtmlList = () => {
  const crops = getUniqueCropList();
  $('#numOfCrops').text(crops.length);
  let cropsHtml = `<option value="" selected="selected"> Select Crop </option>\n`;
  cropsHtml += crops.sort().map(data => `<option value="${data}">${data}</option>`).join('\n');
  $('#Crop').html(cropsHtml);
  $('#all-crops').prop('checked', true);
  $('#Crop option').prop('selected', true);
  $('#Crop').fSelect('reload');
}

/**
 * To get list of contries by continent.
 */
const getContriesByContinent = () => {
  const val = $('#Continent').val();
  const continent = val && Array.isArray(val) ? val.filter(data => data) : [];
  const conuntries = getCountriesList();
  $('#numOfCountry').text(conuntries.length);
  let countryHtml = `
  <option value="" selected="selected"> Select Countries </option> \n`;
  countryHtml += conuntries.map(data => `<option value="${data.countryName}">${data.countryName}</option>`).join('\n');
  $('#Countries').html(countryHtml);
  $('#all-contries').prop('checked', true);
  $('#Countries option').prop('selected', true);
  $('#Countries').fSelect('reload');
}

/**
 * To get list of Years.
 */
const getYearList = () => {
  $('#numOfYears').text('0');
  $('#Years').html('');
  $('#Years').fSelect('reload');
  yearList = getYearUniqueYearList();
  $('#numOfYears').text(yearList.length);
  if (yearList && yearList.length) {
    let yearHtml = `<option value="" selected="selected"> Select Years </option> \n`;
    yearHtml += yearList.map(data => `<option value="${data}">${data}</option>`).join('\n');
    $('#Years').html(yearHtml);
    $('#all-years').prop('checked', true);
    $('#Years option').prop('selected', true);
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
  const programList = Array.from(new Set(selectedTrial.filter(data => data.program).map(data => data.program))).map(data => `
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
  $('#allTrialsName').html('')
  $('#all-studyNames').prop('checked', false);
  $('#studyName').fSelect('reload');
  let studyNameHtml = '<option value="" selected="selected"> Select Study Name </option>';
  const programVal = getFieldValue($('#program').val());
  if (programVal) {
    const studyNameList = Array.from(new Set(selectedTrial.filter(data => data.studyName && programVal.includes(data.program)).map(data => data.studyName)))
      .map(data => ` <option value="${data}">${data}</option>`).join('\n');
    if (studyNameList) {
      studyNameHtml += studyNameList;
    }
    $('#studyName').html(studyNameHtml);
    $('#studyName').fSelect('reload');
  }
}

/**
* To get list of Trials Names by Study Name.
*/
const getTrialsNameList = () => {
  $('#allTrialsName').html('');
  $('#studyNameTitle').html('');
  const studyNameVal = getFieldValue($('#studyName').val());
  if (studyNameVal) {
    const studyNameList = Array.from(new Set(selectedTrial.filter(data => (data.studyName) && studyNameVal.includes(data.studyName)).map(data => data.studyName)))
      .map(data => {
        const record = selectedTrial.find(fdata => fdata.studyName === data && studyNameVal.includes(fdata.studyName));
        return `<a onclick="onStudiesClick(event, '${record.crop}', '${record.studyDbId}', '${record.status}', '${record.studyName}')" class="list-group-item list-group-item-action ${record.status && record.status.includes('Trait Data Success') ? 'text-success' : 'text-warning'}">${data}</a>`
      }).join('\n');
    if (studyNameList) {
      $('#allTrialsName').html(studyNameList);
    }
  }
}

const getAllDesignList = () => {
  $('#numofdesign').text('0');
  $('#designs').html('');
  $('#designs').fSelect('reload');
  designList = getDesignList();
  $('#numofdesign').text(designList.length);
  if (designList && designList.length) {
    let yearHtml = `<option value="" selected="selected"> Select Designs </option> \n`;
    yearHtml += designList.map(data => `<option value="${data}">${data}</option>`).join('\n');
    $('#designs').html(yearHtml);
    $('#all-designs').prop('checked', true);
    $('#designs option').prop('selected', true);
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
 * To get selected trials
 */
getSelectedTrials = () => {
  $('#numOfTrials').text('0');
  $('#numOfNursery').text('0');
  $('#program').val([]);
  $('#program').html('');
  $('#program').fSelect('reload');
  $('#all-programs').prop('checked', false);
  $('#studyName').val([]);
  $('#studyName').html('');
  $('#studyName').fSelect('reload');
  $('#all-studyNames').prop('checked', false);
  $('#traitNames').html('');
  $('#traitsTBody').html('');
  $('#traitsCharts').html('');
  $('#style-11').attr('style', '');
  $('#allTrialsName').html('');
  $('#studyNameTitle').html('');
  $('#programsTable').html('');
  if (cluster) cluster.clearLayers();

  const conuntryVal = getFieldValue($('#Countries').val());
  const cropVal = getFieldValue($('#Crop').val());
  const yearVal = getFieldValue($('#Years').val());
  const designVal = getFieldValue($('#designs').val());

  const isBelongStudyType = (studyType) => {
    if ($('#all-Nurseries').prop('checked') && $('#all-trials').prop('checked')) {
      return true
    } else if (!$('#all-Nurseries').prop('checked') && $('#all-trials').prop('checked')) {
      return studyType === 'Trial';
    } else if ($('#all-Nurseries').prop('checked') && !$('#all-trials').prop('checked')) {
      return studyType === 'Nursery';
    }
  }


  selectedTrial = allTrialsList.filter(data => conuntryVal.includes(data.locationCountry)
    && cropVal.includes(data.crop) && yearVal.includes(data.startDate.substring(0, 4))
    && designVal.includes(data.experimentalDesign) && isBelongStudyType(data.studyType));




  if (selectedTrial && selectedTrial.length) {
    const trials = selectedTrial.filter(data => data.studyType === 'Trial');
    const nurseries = selectedTrial.filter(data => data.studyType === 'Nursery');
    $('#numOfTrials').text(trials.length);
    $('#numOfNursery').text(nurseries.length);
    setTimeout(() => { generateNurTrialChartVertical() });
    setTimeout(() => { generateCountryTrialsChart() });
    setTimeout(() => { generateCountryNurseriesChart() });
    setTimeout(() => { generateProgramTableData(selectedTrial) });
    setTimeout(() => { generateExprimentalChart(selectedTrial) });
    setTimeout(() => { generateMapMarkerToolTip(false) });
    setTimeout(() => { getProgramList() });
  }
}

const onStudiesClick = (event, crop, trialNo, status, studyName) => {
  status = status.split(',');
  if (event && event.target) {
    $(event.target).siblings().removeClass('active');
    $(event.target).addClass('active');
  }
  $('#studyNameTitle').html(studyName);
  $('#traitNames').html('');
  $('#traitsTBody').html('');
  $('#traitsCharts').html('');
  $('#style-11').attr('style', '');
  if (!status.includes('Trait Data Success')) {
    $('#messageBody').html(status[1])
    $('#messagebox').trigger('click');
  } else {
    get(`traits/?cropName=${crop}&studyDbId=${trialNo}`).then(response => {
      if (response && response.data) {
        traitsData = response.data;
        if (traitsData) {
          const tBodyHtml = traitsData.filter(data => data.traitName).map((data, index) =>
            `<tr>
            <td>
               <div class="cell">
                <span style="width:100%" data-value="100">${index + 1}</span>
              </div>
            </td>
            <td data-toggle="tooltip" data-placement="top" title="${data.desc ? data.desc : data.traitName}"> ${data.traitName} </td>
            <td> 
              <div class="cell">
                <span style="width:100%" data-value="100">${!isNaN(Number(data.min)) ? Number(Number(data.min).toFixed(1)) : data.min}</span>
              </div>
            </td>

            <td>
              <div class="cell">
                <span style="width:100%" data-value="100">${!isNaN(Number(data.mean)) ? Number(Number(data.mean).toFixed(1)) : data.mean}</span>
              </div>
            </td>

            <td>
               <div class="cell">
                <span style="width:100%" data-value="100">${!isNaN(Number(data.max)) ? Number(Number(data.max).toFixed(1)) : data.max}</span>
              </div>
            </td>
          </tr>`).join('\n');
          const chartHtml = traitsData.filter(traitData => !(isNaN(traitData.min) || isNaN(traitData.max) || isNaN(traitData.mean)))
            .map(chartData => `<div title="${chartData.desc ? chartData.desc : chartData.traitName}"  class="col-sm-3 pt-0 pb-1">
            <div class="h-200 b-lightblue" id="trait_${chartData.traitName}">${chartData.desc}</div></div>`);
          $('#traitsTBody').html(tBodyHtml);
          $('#traitsCharts').html(chartHtml);
          $('#style-11').attr('style', `height:${$('#traits-content').innerHeight()}px!important`);
          traitsData.filter(traitData => !(isNaN(traitData.min) || isNaN(traitData.max) || isNaN(traitData.mean)))
            .map(chartData => setTimeout(() => generateTraitsCharts(chartData)));
        }
      }
    });
  }
}


/*
 * Event fired when Continent value changed.
 */
$('#Continent').on('change', () => {
  const isAllSelected = $('#Continent').val().filter(data => data !== '').length === continentList.length;
  $('#all-continent').prop('checked', isAllSelected);
  $('#numOfCountry').text('0');
  $('#Countries').html('');
  $('#Countries').fSelect('reload');
  getContriesByContinent();
  getCropsHtmlList();
  getYearList();
  getAllDesignList();
});

/*
 * Event fired when Crop value changed.
 */
$('#Crop').on('change', () => {
  const isAllSelected = selectedCrops().length === getUniqueCropList().length;
  $('#all-crops').prop('checked', isAllSelected);
  getYearList();
  getAllDesignList();
});

/*
 * Event fired when Country value changed.
 */
$('#Countries').on('change', () => {
  const isAllSelected = selectedCountries().length === getCountriesList().length;
  $('#all-contries').prop('checked', isAllSelected);
  getCropsHtmlList();
  getYearList();
  getAllDesignList();
});

/*
 * Event fired when Year value changed.
 */
$('#Years').on('change', () => {
  const isAllSelected = selectedYears().length === getYearUniqueYearList().length;
  $('#all-years').prop('checked', isAllSelected);
});

/*
 * Event fired when Year value changed.
 */
$('#designs').on('change', () => {
  const isAllSelected = selectedDesigns().length === getDesignList().length;
  $('#all-designs').prop('checked', isAllSelected);
});

/*
 * Event fired when Program value changed.
 */
$('#program').on('change', () => {
  const isAllSelected = selectedPrograms().length === programOptionList().length;
  $('#all-programs').prop('checked', isAllSelected);
  getStudyNameList();
});

$('#studyName').on('change', () => {
  const isAllSelected = selectedStudyName().length === studyTypeOptionList().length;
  $('#all-studyNames').prop('checked', isAllSelected);
  getTrialsNameList();
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

/**
* Event fired when map option is changed
*/
$('.map-options').on('click', (event) => {
  const element = $(event.target);
  $('.map-options').removeClass('radio-selected');
  $('.map-options').css({ 'background-color': '#2e2e2e' });
  if (element.children().length > 1) {
    element.children()[1].click();
    element.addClass('radio-selected');
  } else {
    element.parent().click();
    element.parent().addClass('radio-selected');
  }
  if ($(`input[name='map-radio']:checked`).val() === 'Advanced') {
    $('.radio-selected').css({ 'background-color': '#1aa3ff' });
  } else if ($(`input[name='map-radio']:checked`).val() === 'Primitive') {
    $('.radio-selected').css({ 'background-color': '#e63b19' });
  } else {
    $('.radio-selected').css({ 'background-color': '#14b825' });
  }
});

$('.map-radio').on('change', () => {
  const radioVal = $(`input[name='map-radio']:checked`).val()
  generateMapMarkerToolTip(false);
});

$('#all-trials').on('change', (event) => {
  if (!$('#all-Nurseries').prop('checked')) {
    event.stopPropagation();
    $('#messageBody').html('Either Nurseries or Trials checkbox must be selected');
    $('#messagebox').trigger('click');
    $('#all-trials').prop('checked', true);
    return;
  }
  generateMapMarkerToolTip(false);
  getSelectedTrials();
});

$('#all-Nurseries').on('change', (event) => {
  if (!$('#all-trials').prop('checked')) {
    event.stopPropagation();
    $('#messageBody').html('Either Nurseries or Trials checkbox must be selected');
    $('#messagebox').trigger('click');
    $('#all-Nurseries').prop('checked', true);
    return;
  }
  generateMapMarkerToolTip(false);
  getSelectedTrials();
});

const clearAll = () => {
  $('#all-continent, #all-contries, #all-crops, #all-years, #all-designs, #all-programs, #all-studyNames').prop('checked', false);
  $('#Continent option, #Countries option, #Crop option, #Years option, #designs option, #program option, #studyName option').prop('selected', false);
  $('#Countries, #Crop, #Years, #designs, #program, #studyName').fSelect('reload');
  $('#numOfTrials').text('0');
  $('#numOfNursery').text('0');
  disponseTrialNurseryChart();
  // disponsereplicationgraph();
}

const getNonEmpty = (data) => data !== '';
const selectedContinent = () => $('#Continent').val().filter(getNonEmpty);
const selectedCountries = () => $('#Countries').val().filter(getNonEmpty);
const selectedCrops = () => $('#Crop').val().filter(getNonEmpty);
const selectedYears = () => $('#Years').val().filter(getNonEmpty);
const selectedDesigns = () => $('#designs').val().filter(getNonEmpty);
const selectedPrograms = () => $('#program').val().filter(getNonEmpty);
const selectedStudyName = () => $('#studyName').val().filter(getNonEmpty);
const getCountriesList = () => continentList.filter(data => selectedContinent()
  .includes(data.continent)).map(data => data.countries).flat();
const getCropsList = () => getCountriesList().filter(data => selectedCountries()
  .includes(data.countryName)).map(data => data.crops).flat();

const getUniqueCropList = () => Array.from(new Set(getCropsList().map(data => data.cropName)));

const getUniqueCropNameList = () => Array.from(new Set(getCropsList().map(data => data.cropName))).sort();

const getYearUniqueYearList = () => Array.from(new Set(getCropsList().filter(data => selectedCrops().includes(data.cropName)).map(data => data.years).flat().map(data => data.year))).sort();

const getDesignList = () => Array.from(new Set(getCropsList().filter(data => selectedCrops().includes(data.cropName)).map(data => data.experimentalDesign).flat().map(data => data.experimentalDesign))).sort();

const programOptionList = () => Array.from($('#program').children()).filter(data => data.value);

const studyTypeOptionList = () => Array.from($('#studyName').children()).filter(data => data.value);

const generateTraitsCharts = (chartData) => {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end
    // Create chart instance
    const chart = am4core.create(`trait_${chartData.traitName}`, am4charts.XYChart);
    chart.logo.disabled = true;
    let title = chart.titles.create();
    title.text = chartData.traitName;
    title.fontSize = 12;
    title.marginBottom = 5;
    // Add data
    chart.data = [
      { 'traitName': 'Min', 'value': chartData.min },
      { 'traitName': 'Mean', 'value': chartData.mean },
      { 'traitName': 'Max', 'value': chartData.max },
    ];
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "traitName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    const createSeries = (yValue, name) => {
      // Create series
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = yValue;
      series.dataFields.categoryX = "traitName";
      series.name = name;
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;
      const columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });
    }

    createSeries('value', 'Traits');
  }); // end am4core.ready()
}

$('#search').on('click', () => {
 let msg = `Select atleast`;
  if (!$('#Continent').val() || !$('#Continent').val().length) {
    msg += ' one continent,';
     }
  if (!$('#Countries').val() || !$('#Countries').val().length) {
    msg += ' one country,';
  }
  if (!$('#Crop').val() || !$('#Crop').val().length) {
    msg += ' one crop,';
  }
  if (!$('#Years').val() || !$('#Years').val().length) {
    msg += ' one year,';
  }
  if (!$('#designs').val() || !$('#designs').val().length) {
    msg += ' one design,';
  }
  if(msg !== 'Select atleast'){
    $('#messageBody').html(msg);
    $('#messagebox').trigger('click');
    return false
  }
  getSelectedTrials();
});

const fillMissingCountryDetails = () => {
  allTrialsList.forEach(element => {
    if (!element.latitude || !element.longitude) {
      const country = countryList.find(fdata => fdata.countryName === element.locationCountry);
      if (country) {
        element.latitude = country.latitude;
        element.longitude = country.longitude;
      }
    }
  });
}

const arrangeCropCountryDesign = () => {
  continentList.forEach(continent => {
    continent.countries.map(country => {
      country['crops'] = Array.from(new Set(allTrialsList
        .filter(resData => resData.locationCountry === country.countryName && resData.crop)
        .map(resData => resData.crop))).
        map(cropData => {
          const cropResult = { 'cropName': cropData };
          cropResult['years'] = Array.from(new Set(allTrialsList
            .filter(data => data.locationCountry === country.countryName && data.crop === cropData && data.startDate)
            .map(year => year.startDate.substring(0, 4)))).sort()
            .map(year => {
              return { 'year': year };
            });
          cropResult['experimentalDesign'] = Array.from(new Set(allTrialsList
            .filter(data => data.locationCountry === country.countryName && data.crop === cropData && data.experimentalDesign)
            .map(data => data.experimentalDesign))).sort()
            .map(experimentalDesign => {
              return { 'experimentalDesign': experimentalDesign };
            });
          return cropResult;
        });
    })
  });
}