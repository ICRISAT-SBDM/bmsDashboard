generateCountryTrialsChart = () => {
    const countryTrials = selectedTrail.filter(data => data.studyType == 'Trial');
    countries = Array.from(new Set(countryTrials.map(data => data.locationCountry)));
    const chartData = countries.map(data => {
        var country = data;
        var trials = countryTrials.filter(fData => fData.locationCountry === country).length;
        return {'country': country, 'trials': trials}
    });
    generateCountryTrialsBarChart(chartData);
}

generateCountryTrialsBarChart = (chartData) =>{


    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        
        var chart = am4core.create("country_level_trails", am4charts.XYChart);
        
        chart.data = chartData;
        
        chart.padding(40, 40, 40, 40);
        
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.1;
        //valueAxis.rangeChangeEasing = am4core.ease.linear;
        //valueAxis.rangeChangeDuration = 1500;
        
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.columns.template.fill = am4core.color("#5faa46"); // greeen outline
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "trials";
        series.tooltipText = "{valueY.value}"
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.cornerRadiusTopLeft = 10;
        //series.interpolationDuration = 1500;
        //series.interpolationEasing = am4core.ease.linear;
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.verticalCenter = "bottom";
        labelBullet.label.dy = -10;
        labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
        
        chart.zoomOutButton.disabled = true;
        
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        // series.columns.template.adapter.add("fill", function (fill, target) {
        //  return chart.colors.getIndex(target.dataItem.index);
        // });
        
        
        
        categoryAxis.sortBySeries = series;
        
        }); // end am4core.ready()

}
