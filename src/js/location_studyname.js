generateLocationStudyNameChart = (chartData) => {


  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv2", am4charts.SankeyDiagram);
    chart.logo.dom.style.display = 'none'
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = chartData;

    let hoverState = chart.links.template.states.create("hover");
    hoverState.properties.fillOpacity = 0.6;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "studyNames";
    chart.dataFields.value = "value";

    chart.links.template.propertyFields.id = "id";
    chart.links.template.colorMode = "solid";
    chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    chart.links.template.fillOpacity = 0.1;
    chart.links.template.tooltipText = "";

    // highlight all links with the same id beginning
    chart.links.template.events.on("over", function (event) {
      let link = event.target;
      let id = link.id.split("-")[0];

      chart.links.each(function (link) {
        if (link.id.indexOf(id) != -1) {
          link.isHover = true;
        }
      })
    })

    chart.links.template.events.on("out", function (event) {
      chart.links.each(function (link) {
        link.isHover = false;
      })
    })

    // for right-most label to fit
    chart.paddingRight = 100;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.inert = true;
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 20;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

  }); // end am4core.ready()

}
