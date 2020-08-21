let country_level_trials = null;
generateCountryTrialsChart = () => {
  if (country_level_trials && country_level_trials.dispose) {
    country_level_trials.dispose();
  }
  const countryTrials = selectedTrial.filter(data => data.studyType == 'Trial');
  const countries = Array.from(new Set(countryTrials.map(data => data.locationCountry)));
  const crops = Array.from(new Set(countryTrials.map(data => data.crop)));
  const chartData = countries.map(country => {
    const cropsData = crops.map(crop => {
      const result = {};
      const total = countryTrials.filter(data => data.locationCountry === country && data.crop === crop).length;
      result[crop] = total;
      return result;
    });
    return Object.assign({ 'country': country }, Object.assign(...cropsData));
  });
  generateCountryTrialsBarChart(chartData, crops);
}

generateCountryTrialsBarChart = (chartData, serieses) => {




  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    country_level_trials = am4core.create("country_level_trials", am4charts.XYChart);


    // Add data
    country_level_trials.data = chartData;
    country_level_trials.colors.list = [
      am4core.color("#845EC2"),
      am4core.color("#D65DB1"),
      am4core.color("#FF6F91"),
      am4core.color("#FF9671"),
      am4core.color("#c7850c"),
    ];

    // Create axes
    var categoryAxis = country_level_trials.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.location = 0.5;

    categoryAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
      return -target.maxRight / 2;
    })

    const maxChartValue = Math.max(...chartData.map(data => Object.keys(data).filter(key => key !== 'country').map(key => data[key]).reduce((v1, v2) => v1 + v2, 0)));
    var valueAxis = country_level_trials.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    var axisBreak = valueAxis.axisBreaks.create();
    axisBreak.startValue = (maxChartValue / 100) * 10;
    axisBreak.endValue = (maxChartValue / 100) * 95;

    // fixed axis break
    var d = (axisBreak.endValue - axisBreak.startValue) / (maxChartValue - valueAxis.min);
    axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

    // make break expand on hover
    var hoverState = axisBreak.states.create("hover");
    hoverState.properties.breakSize = 1;
    hoverState.properties.opacity = 0.1;
    hoverState.transitionDuration = 1500;

    axisBreak.defaultState.transitionDuration = 1000;

    // Create series
    function createSeries(field, name) {

      // Set up series
      var series = country_level_trials.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "country";
      series.sequencedInterpolation = true;

      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet());

      return series;
    }
    serieses.forEach(data => {
      createSeries(data, data);
    });

    // Legend
    country_level_trials.legend = new am4charts.Legend();

  }); // end am4core.ready()

}
