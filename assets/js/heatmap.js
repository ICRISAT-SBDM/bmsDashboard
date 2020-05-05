Highcharts.chart('heat-map', {

	chart: {
		type: 'heatmap',
		marginTop: 40,
		marginBottom: 80,
		plotBorderWidth: 1
	},


	title: {
		text: null
	},

	xAxis: {
		categories: ['Chickpea', "Finger Millet", "Groundnut", "Pearl Millet", "Sorghum", "Pigeonpea"]
	},

	yAxis: {
		categories: ["Lines", "Icrisat Lines", "Nutritional Traits", "Breeder Seed", "Foundation Seed", "Certified Seed"],
		title: null
	},

	colorAxis: {
		min: 0,
		minColor: '#FFFFFF',
		maxColor: Highcharts.getOptions().colors[2]
	},

	legend: {
		align: 'right',
		layout: 'vertical',
		margin: 0,
		verticalAlign: 'top',
		y: 25,
		symbolHeight: 280
	},

	tooltip: {
		formatter: function () {


		return '<b>' + this.point.value + ' </b> uploads <br> under <b>' + this.series.yAxis.categories[this.point.y] +
			'</b> <br>for <b>' + this.series.xAxis.categories[this.point.x] + '</b>'
		}
	},

	series: [{
		name: 'Sales per employee',
		borderWidth: 1,
		data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [0, 5, 23],
				[1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [1, 5, 14],
				[2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [2, 5, 56],
				[3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [3, 5, 7],
				[4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [4, 5, 17],
				[5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [5, 5, 81]],
		dataLabels: {
		enabled: true,
		color: '#000000'
		}
	}],

	responsive: {
		rules: [{
		condition: {
			maxWidth: 500
		},
		chartOptions: {
			yAxis: {
			labels: {
				formatter: function () {
				return this.value.charAt(0);
				}
			}
			}
		}
		}]
	}
});Highcharts.chart('heat-map', {

	chart: {
		type: 'heatmap',
		marginTop: 40,
		marginBottom: 80,
		plotBorderWidth: 1
	},


	title: {
		text: null
	},

	xAxis: {
		categories: ['Chickpea', "Finger Millet", "Groundnut", "Pearl Millet", "Sorghum", "Pigeonpea"]
	},

	yAxis: {
		categories: ["Lines", "Icrisat Lines", "Nutritional Traits", "Breeder Seed", "Foundation Seed", "Certified Seed"],
		title: null
	},

	colorAxis: {
		min: 0,
		minColor: '#FFFFFF',
		maxColor: Highcharts.getOptions().colors[2]
	},

	legend: {
		align: 'right',
		layout: 'vertical',
		margin: 0,
		verticalAlign: 'top',
		y: 25,
		symbolHeight: 280
	},

	tooltip: {
		formatter: function () {


		return '<b>' + this.point.value + ' </b> uploads <br> under <b>' + this.series.yAxis.categories[this.point.y] +
			'</b> <br>for <b>' + this.series.xAxis.categories[this.point.x] + '</b>'
		}
	},

	series: [{
		name: 'Sales per employee',
		borderWidth: 1,
		data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [0, 5, 23],
				[1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [1, 5, 14],
				[2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [2, 5, 56],
				[3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [3, 5, 7],
				[4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [4, 5, 17],
				[5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [5, 5, 81]],
		dataLabels: {
		enabled: true,
		color: '#000000'
		}
	}],

	responsive: {
		rules: [{
		condition: {
			maxWidth: 500
		},
		chartOptions: {
			yAxis: {
			labels: {
				formatter: function () {
				return this.value.charAt(0);
				}
			}
			}
		}
		}]
	}
});