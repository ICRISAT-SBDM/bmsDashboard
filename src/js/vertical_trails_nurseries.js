let verticalTrailNur = null;
generateNurTrialChartVertical = () => {
    const studyTypeTrails = selectedTrail.filter(data => data.studyType);
    years = Array.from(new Set(studyTypeTrails.map(data => data.startDate.substring(0,4)))).sort((d1,d2) => Number(d1) - Number(d2));
    const chartData = years.map(data => {
    const year = data;
    const trails = studyTypeTrails.filter(fData => fData.studyType === 'Trial' && fData.startDate.substring(0,4) === data).length;
    const nursaries = studyTypeTrails.filter(fData => fData.studyType === 'Nursery' && fData.startDate.substring(0,4) === data).length;
    return {'category': year, 'first': trails, 'second': nursaries};
    });
    generateTrialsNurseriesChartVertical(chartData);
};

generateTrialsNurseriesChartVertical = (chartData) => {


    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        verticalTrailNur = am4core.create('vertical_trails_nurseries', am4charts.XYChart)
        verticalTrailNur.colors.step = 2;
        
        verticalTrailNur.legend = new am4charts.Legend()
        verticalTrailNur.legend.position = 'top'
        verticalTrailNur.legend.paddingBottom = 20
        verticalTrailNur.legend.labels.template.maxWidth = 95
        
        var xAxis = verticalTrailNur.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'category'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;
        
        var yAxis = verticalTrailNur.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;
        
        function createSeries(value, name) {
            var series = verticalTrailNur.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'category'
            series.name = name
        
            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);
        
            var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#ffffff')
        
            return series;
        }
        
        verticalTrailNur.data = chartData;
        
        
        createSeries('first', 'Trails');
        createSeries('second', 'Nurseries');
        function arrangeColumns() {
        
            var series = verticalTrailNur.series.getIndex(0);
            series.columns.template.tooltipText = "{name}: [bold]{first}[/]";
            var series = verticalTrailNur.series.getIndex(1);
            series.columns.template.tooltipText = "{name}: [bold]{second}[/]";
            series.columns.template.fill = am4core.color("#5faa46"); // greeen outline
        
            var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                var delta = ((x1 - x0) / verticalTrailNur.series.length) * w;
                if (am4core.isNumber(delta)) {
                    var middle = verticalTrailNur.series.length / 2;
        
                    var newIndex = 0;
                    verticalTrailNur.series.each(function(series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = verticalTrailNur.series.indexOf(series);
                        }
                    })
                    var visibleCount = newIndex;
                    var newMiddle = visibleCount / 2;
        
                    verticalTrailNur.series.each(function(series) {
                        var trueIndex = verticalTrailNur.series.indexOf(series);
                        var newIndex = series.dummyData;
        
                        var dx = (newIndex - trueIndex + middle - newMiddle) * delta
        
                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }
        
        }); // end am4core.ready()

}

const disponseTrailNursaryChart = () => {
    if (verticalTrailNur && verticalTrailNur.dispose) verticalTrailNur.dispose();
}
