let exprimentalChart = null;
let exprimentalNurseryChart = null;
const generateExprimentalChart = (selectedData) => {
  if (exprimentalChart && exprimentalChart.dispose) {
    exprimentalChart.dispose();
  }
  if (exprimentalNurseryChart && exprimentalNurseryChart.dispose) {
    exprimentalNurseryChart.dispose();
  }
    const allDesigns = Array.from(new Set(selectedData.filter(data => data.experimentalDesign).map(data => data.experimentalDesign))).sort();
    const chartData = allDesigns.map(data => {
        const result = {'design': data, 'value': 0};
        result.value = selectedData.filter(fData => fData.experimentalDesign === data && fData.studyType === 'Trial').length;
        return result;
        });
        const chartDataNursery = allDesigns.map(data => {
          const result = {'design': data, 'value': 0};
          result.value = selectedData.filter(fData => fData.experimentalDesign === data && fData.studyType === 'Nursery').length;
          return result;
          });

        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            exprimentalChart = am4core.create("stackedchart", am4charts.XYChart);
            exprimentalChart.scrollbarX = new am4core.Scrollbar();

            // Add data
            exprimentalChart.data = chartData;

            // Create axes
            let categoryAxis = exprimentalChart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "design";
            categoryAxis.tooltip.disabled = false;

            let valueAxis = exprimentalChart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.minWidth = 50;
            valueAxis.min = 0;

            // Create series
            let series = exprimentalChart.series.push(new am4charts.ColumnSeries());
            series.sequencedInterpolation = true;
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "design";
            series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
            series.columns.template.strokeWidth = 0;

            series.tooltip.pointerOrientation = "vertical";

            series.columns.template.column.cornerRadiusTopLeft = 10;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.fillOpacity = 0.8;
            series.columns.template.width = am4core.percent(40);

            // on hover, make corner radiuses bigger
            let hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.cornerRadiusTopLeft = 0;
            hoverState.properties.cornerRadiusTopRight = 0;
            hoverState.properties.fillOpacity = 1;

            series.columns.template.adapter.add("fill", function (fill, target) {
              return exprimentalChart.colors.getIndex(target.dataItem.index);
            });

            // Cursor
            exprimentalChart.cursor = new am4charts.XYCursor();

          }); // end am4core.ready()

}