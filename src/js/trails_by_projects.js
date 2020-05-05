 generateTrailByProjectOverYear = (chartData, yearList) => {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("replication", am4charts.XYChart);
    chart.logo.dom.style.display = 'none';
    chart.padding(40, 40, 40, 40);

    chart.numberFormatter.bigNumberPrefixes = [
      { "number": 1e+3, "suffix": "K" },
      { "number": 1e+6, "suffix": "M" },
      { "number": 1e+9, "suffix": "B" }
    ];

    var label = chart.plotContainer.createChild(am4core.Label);
    label.x = am4core.percent(97);
    label.y = am4core.percent(95);
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";
    label.dx = -15;
    label.fontSize = 50;

    var playButton = chart.plotContainer.createChild(am4core.PlayButton);
    playButton.x = am4core.percent(97);
    playButton.y = am4core.percent(95);
    playButton.dy = -2;
    playButton.verticalCenter = "middle";
    playButton.events.on("toggled", function (event) {
      if (event.target.isActive) {
        play();
      }
      else {
        stop();
      }
    })

    var stepDuration = 4000;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "program";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration;
    valueAxis.extraMax = 0.1;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "program";
    series.dataFields.valueX = "value";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.interpolationDuration = stepDuration;
    series.interpolationEasing = am4core.ease.linear;

    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    let index = 0;
    var year = yearList[index];
    label.text = year.toString();

    var interval;

    function play() {
      interval = setInterval(function () {
        nextYear();
      }, stepDuration)
      nextYear();
    }

    function stop() {
      if (interval) {
        clearInterval(interval);
      }
    }

    function nextYear() {
      index++;

      if (index >= yearList.length) {
        index = 0;
      }
      year = yearList[index];

      var newData = allData[year];
      var itemsWithNonZero = 0;
      for (var i = 0; i < chart.data.length; i++) {
        chart.data[i].value = newData[i] ? newData[i].value: 0;
        if (chart.data[i].value > 0) {
          itemsWithNonZero++;
        }
      }

      if (year == yearList[0]) {
        series.interpolationDuration = stepDuration / 4;
        valueAxis.rangeChangeDuration = stepDuration / 4;
      }
      else {
        series.interpolationDuration = stepDuration;
        valueAxis.rangeChangeDuration = stepDuration;
      }

      chart.invalidateRawData();
      label.text = year.toString();

      categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
    }


    categoryAxis.sortBySeries = series;

    var allData = chartData; /* {
      "2003": [
        {
          "program": "project 1",
          "value": 0
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 0
        },

        {
          "program": "Project 4",
          "value": 4470000
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 0
        }
      ],
      "2004": [
        {
          "program": "project 1",
          "value": 0
        },
        {
          "program": "Project 2",
          "value": 3675135
        },
        {
          "program": "Project 4",
          "value": 5970054
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 980036
        },
        {
          "program": "Project 9",
          "value": 4900180
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 0
        }
      ],
      "2005": [
        {
          "program": "project 1",
          "value": 0
        },
        {
          "program": "Project 2",
          "value": 7399354
        },
        {
          "program": "Project 4",
          "value": 7459742
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 9731610
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 19490059
        },
        {
          "program": "Project 9",
          "value": 9865805
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 1946322
        }
      ],
      "2006": [
        {
          "program": "project 1",
          "value": 0
        },
        {
          "program": "Project 2",
          "value": 14949270
        },
        {
          "program": "Project 4",
          "value": 8989854
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 19932360
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 54763260
        },
        {
          "program": "Project 9",
          "value": 14966180
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 248309
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 19878248
        }
      ],
      "2007": [
        {
          "program": "project 1",
          "value": 0
        },
        {
          "program": "Project 2",
          "value": 29299875
        },
        {
          "program": "Project 4",
          "value": 24253200
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 29533250
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 69299875
        },
        {
          "program": "Project 9",
          "value": 26916562
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 488331
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 143932250
        }
      ],
      "2008": [
        {
          "program": "project 1",
          "value": 100000000
        },
        {
          "program": "Project 2",
          "value": 30000000
        },
        {
          "program": "Project 4",
          "value": 51008911
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 55045618
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 72408233
        },
        {
          "program": "Project 9",
          "value": 44357628
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 1944940
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 294493950
        }
      ],
      "2009": [
        {
          "program": "project 1",
          "value": 276000000
        },
        {
          "program": "Project 2",
          "value": 41834525
        },
        {
          "program": "Project 4",
          "value": 28804331
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 57893524
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 70133095
        },
        {
          "program": "Project 9",
          "value": 47366905
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 3893524
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 0
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 0
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 413611440
        }
      ],
      "2010": [
        {
          "program": "project 1",
          "value": 517750000
        },
        {
          "program": "Project 2",
          "value": 54708063
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 166029650
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 59953290
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 68046710
        },
        {
          "program": "Project 9",
          "value": 49941613
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 43250000
        },
        {
          "program": "Project 16",
          "value": 0
        },
        {
          "program": "Project 17",
          "value": 19532900
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 480551990
        }
      ],
      "2011": [
        {
          "program": "project 1",
          "value": 766000000
        },
        {
          "program": "Project 2",
          "value": 66954600
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 170000000
        },
        {
          "program": "Project 5",
          "value": 0
        },
        {
          "program": "Project 6",
          "value": 46610848
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 46003536
        },
        {
          "program": "Project 9",
          "value": 47609080
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 0
        },
        {
          "program": "Project 15",
          "value": 92750000
        },
        {
          "program": "Project 16",
          "value": 47818400
        },
        {
          "program": "Project 17",
          "value": 48691040
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 642669824
        }
      ],
      "2012": [
        {
          "program": "project 1",
          "value": 979750000
        },
        {
          "program": "Project 2",
          "value": 79664888
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 170000000
        },
        {
          "program": "Project 5",
          "value": 107319100
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 0
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 45067022
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 146890156
        },
        {
          "program": "Project 15",
          "value": 160250000
        },
        {
          "program": "Project 16",
          "value": 118123370
        },
        {
          "program": "Project 17",
          "value": 79195730
        },
        {
          "program": "Project 18",
          "value": 0
        },
        {
          "program": "Project 19",
          "value": 844638200
        }
      ],
      "2013": [
        {
          "program": "project 1",
          "value": 1170500000
        },
        {
          "program": "Project 2",
          "value": 80000000
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 170000000
        },
        {
          "program": "Project 5",
          "value": 205654700
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 117500000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 0
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 293482050
        },
        {
          "program": "Project 15",
          "value": 223675000
        },
        {
          "program": "Project 16",
          "value": 196523760
        },
        {
          "program": "Project 17",
          "value": 118261880
        },
        {
          "program": "Project 18",
          "value": 300000000
        },
        {
          "program": "Project 19",
          "value": 1065223075
        }
      ],
      "2014": [
        {
          "program": "project 1",
          "value": 1334000000
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 170000000
        },
        {
          "program": "Project 5",
          "value": 254859015
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 250000000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 135786956
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 388721163
        },
        {
          "program": "Project 15",
          "value": 223675000
        },
        {
          "program": "Project 16",
          "value": 444232415
        },
        {
          "program": "Project 17",
          "value": 154890345
        },
        {
          "program": "Project 18",
          "value": 498750000
        },
        {
          "program": "Project 19",
          "value": 1249451725
        }
      ],
      "2015": [
        {
          "program": "project 1",
          "value": 1516750000
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 170000000
        },
        {
          "program": "Project 5",
          "value": 298950015
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 400000000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 0
        },
        {
          "program": "Project 11",
          "value": 163346676
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 475923363
        },
        {
          "program": "Project 15",
          "value": 304500000
        },
        {
          "program": "Project 16",
          "value": 660843407
        },
        {
          "program": "Project 17",
          "value": 208716685
        },
        {
          "program": "Project 18",
          "value": 800000000
        },
        {
          "program": "Project 19",
          "value": 1328133360
        }
      ],
      "2016": [
        {
          "program": "project 1",
          "value": 1753500000
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 398648000
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 550000000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 143250000
        },
        {
          "program": "Project 11",
          "value": 238972480
        },
        {
          "program": "Project 12",
          "value": 238648000
        },
        {
          "program": "Project 13",
          "value": 0
        },
        {
          "program": "Project 14",
          "value": 565796720
        },
        {
          "program": "Project 15",
          "value": 314500000
        },
        {
          "program": "Project 16",
          "value": 847512320
        },
        {
          "program": "Project 17",
          "value": 281026560
        },
        {
          "program": "Project 18",
          "value": 1000000000
        },
        {
          "program": "Project 19",
          "value": 1399053600
        }
      ],
      "2017": [
        {
          "program": "project 1",
          "value": 2035750000
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 495657000
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 750000000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 195000000
        },
        {
          "program": "Project 11",
          "value": 297394200
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 239142500
        },
        {
          "program": "Project 14",
          "value": 593783960
        },
        {
          "program": "Project 15",
          "value": 328250000
        },
        {
          "program": "Project 16",
          "value": 921742750
        },
        {
          "program": "Project 17",
          "value": 357569030
        },
        {
          "program": "Project 18",
          "value": 1333333333
        },
        {
          "program": "Project 19",
          "value": 1495657000
        }
      ],
      "2018": [
        {
          "program": "project 1",
          "value": 2255250000
        },
        {
          "program": "Project 2",
          "value": 0
        },
        {
          "program": "Project 4",
          "value": 0
        },
        {
          "program": "Project 3",
          "value": 0
        },
        {
          "program": "Project 5",
          "value": 430000000
        },
        {
          "program": "Project 6",
          "value": 0
        },
        {
          "program": "Project 7",
          "value": 1000000000
        },
        {
          "program": "Project 8",
          "value": 0
        },
        {
          "program": "Project 9",
          "value": 0
        },
        {
          "program": "Project 10",
          "value": 246500000
        },
        {
          "program": "Project 11",
          "value": 355000000
        },
        {
          "program": "Project 12",
          "value": 0
        },
        {
          "program": "Project 13",
          "value": 500000000
        },
        {
          "program": "Project 14",
          "value": 624000000
        },
        {
          "program": "Project 15",
          "value": 329500000
        },
        {
          "program": "Project 16",
          "value": 1000000000
        },
        {
          "program": "Project 17",
          "value": 431000000
        },
        {
          "program": "Project 18",
          "value": 1433333333
        },
        {
          "program": "Project 19",
          "value": 1900000000
        }
      ]
    }*/

    chart.data = JSON.parse(JSON.stringify(allData[String(year)]));
    categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

    series.events.on("inited", function () {
      setTimeout(function () {
        playButton.isActive = true; // this starts interval
      }, 2000)
    })

  }); // end am4core.ready()
 }
 