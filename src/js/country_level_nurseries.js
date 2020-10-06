let country_level_nurseries = null;
generateCountryNurseriesChart = () => {
  if (country_level_nurseries && country_level_nurseries.dispose) {
    country_level_nurseries.dispose();
  }
  const countryNurseries = selectedTrial.filter(data => data.studyType == 'Nursery');
  const countries = Array.from(new Set(countryNurseries.map(data => data.locationCountry)));
  const crops = Array.from(new Set(countryNurseries.map(data => data.crop)));
  const chartData = countries.map(country => {
    const cropsData = crops.map(crop => {
      const result = {};
      const total = countryNurseries.filter(data => data.locationCountry === country && data.crop === crop).length;
      result[crop] = total;
      return result;
    });
    return Object.assign({ 'country': country }, Object.assign(...cropsData));
  });
  generateCountryNurseriesBarChart(chartData, crops);
}

generateCountryNurseriesBarChart = (chartData, serieses) => {


  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    country_level_nurseries = am4core.create("country_level_nurseries", am4charts.XYChart);

    country_level_nurseries.colors.list = [
      am4core.color("#845EC2"),
      am4core.color("#D65DB1"),
      am4core.color("#FF6F91"),
      am4core.color("#FF9671"),
      am4core.color("#c7850c"),
    ];


    // Add data
    country_level_nurseries.data = chartData.sort((v1,v2) => v1.country < v2.country ? -1 : 0);;

    // Create axes
    var categoryAxis = country_level_nurseries.xAxes.push(new am4charts.CategoryAxis());
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
    var valueAxis = country_level_nurseries.yAxes.push(new am4charts.ValueAxis());
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
      var series = country_level_nurseries.series.push(new am4charts.ColumnSeries());
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
      // labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;

      return series;
    }
    serieses.sort().forEach(data => {
      createSeries(data, data);
    });

    // Legend
    country_level_nurseries.legend = new am4charts.Legend();

  }); // end am4core.ready()

}
