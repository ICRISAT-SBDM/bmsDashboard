let verticalTrialNur = null;
generateNurTrialChartVertical = () => {
    const studyTypeTrials = selectedTrial.filter(data => data.studyType);
    years = Array.from(new Set(studyTypeTrials.map(data => data.startDate.substring(0, 4)))).sort((d1, d2) => Number(d1) - Number(d2));
    const chartData = years.map(data => {
        const year = data;
        const trials = studyTypeTrials.filter(fData => fData.studyType === 'Trial' && fData.startDate.substring(0, 4) === data).length;
        const nurseries = studyTypeTrials.filter(fData => fData.studyType === 'Nursery' && fData.startDate.substring(0, 4) === data).length;
        return { 'category': year, 'first': trials, 'second': nurseries };
    });
    generateTrialsNurseriesChartVertical(chartData);
};

generateTrialsNurseriesChartVertical = (chartData) => {


    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        verticalTrialNur = am4core.create('vertical_trials_nurseries', am4charts.XYChart)
        verticalTrialNur.colors.step = 2;
        verticalTrialNur.data = chartData;

        verticalTrialNur.legend = new am4charts.Legend()
        verticalTrialNur.legend.position = 'top'
        verticalTrialNur.legend.paddingBottom = 20
        verticalTrialNur.legend.labels.template.maxWidth = 95

        verticalTrialNur.colors.list = [
            am4core.color("#845EC2"),
            am4core.color("#D65DB1"),
            am4core.color("#FF6F91"),
            am4core.color("#FF9671"),
            am4core.color("#c7850c"),
          ];



        var xAxis = verticalTrialNur.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'category'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        const maxChartValue = Math.max(...chartData.map(data => Math.max(data.first, data.second)));

        var yAxis = verticalTrialNur.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

        var axisBreak = yAxis.axisBreaks.create();
        axisBreak.startValue = (maxChartValue / 100) * 10;
        axisBreak.endValue = (maxChartValue / 100) * 95;
        //axisBreak.breakSize = 0.005;

        // fixed axis break
        var d = (axisBreak.endValue - axisBreak.startValue) / (maxChartValue - yAxis.min);
        axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

        // make break expand on hover
        var hoverState = axisBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 1500;

        axisBreak.defaultState.transitionDuration = 1000;

        function createSeries(value, name) {
            var series = verticalTrialNur.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'category'
            series.name = name

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);

            var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            // bullet.label.text = '{valueY}'
            // bullet.label.fill = am4core.color('#ffffff')

            return series;
        }

        createSeries('first', 'Trials');
        createSeries('second', 'Nurseries');
        function arrangeColumns() {

            var series = verticalTrialNur.series.getIndex(0);
            series.columns.template.tooltipText = "{name}: [bold]{first}[/]";
            var series = verticalTrialNur.series.getIndex(1);
            series.columns.template.tooltipText = "{name}: [bold]{second}[/]";
            series.columns.template.fill = am4core.color("#5faa46"); // greeen outline

            var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                var delta = ((x1 - x0) / verticalTrialNur.series.length) * w;
                if (am4core.isNumber(delta)) {
                    var middle = verticalTrialNur.series.length / 2;

                    var newIndex = 0;
                    verticalTrialNur.series.each(function (series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = verticalTrialNur.series.indexOf(series);
                        }
                    })
                    var visibleCount = newIndex;
                    var newMiddle = visibleCount / 2;

                    verticalTrialNur.series.each(function (series) {
                        var trueIndex = verticalTrialNur.series.indexOf(series);
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

const disponseTrialNurseryChart = () => {
    if (verticalTrialNur && verticalTrialNur.dispose) verticalTrialNur.dispose();
}
