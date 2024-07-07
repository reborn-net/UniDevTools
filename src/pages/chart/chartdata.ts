export const chartdata = {
	lineChart: {
		tooltip: {
			trigger: 'axis',
			formatter: function (val) {
				return val[0].value + '(个)'
			}
		},
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [150, 230, 224, 218, 135, 147, 260],
				type: 'line'
			}
		]
	},
	areaChart: {
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line',
				areaStyle: {}
			}
		]
	},
	areaChart2: {
		title: {
			text: 'Stacked Area Chart'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: 'Email',
				type: 'line',
				stack: 'Total',
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: [120, 132, 101, 134, 90, 230, 210]
			},
			{
				name: 'Union Ads',
				type: 'line',
				stack: 'Total',
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: [220, 182, 191, 234, 290, 330, 310]
			},
			{
				name: 'Video Ads',
				type: 'line',
				stack: 'Total',
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: [150, 232, 201, 154, 190, 330, 410]
			},
			{
				name: 'Direct',
				type: 'line',
				stack: 'Total',
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: 'Search Engine',
				type: 'line',
				stack: 'Total',
				label: {
					show: true,
					position: 'top'
				},
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	},
	bar: {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: { show: true, readOnly: false },
				magicType: { show: true, type: ['line', 'bar'] },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		legend: {
			data: ['Evaporation', 'Precipitation', 'Temperature']
		},
		xAxis: [
			{
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				axisPointer: {
					type: 'shadow'
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: 'Precipitation',
				min: 0,
				max: 250,
				interval: 50,
				axisLabel: {
					formatter: '{value} ml'
				}
			},
			{
				type: 'value',
				name: 'Temperature',
				min: 0,
				max: 25,
				interval: 5,
				axisLabel: {
					formatter: '{value} °C'
				}
			}
		],
		series: [
			{
				name: 'Evaporation',
				type: 'bar',
				tooltip: {
					valueFormatter: function (value) {
						return value + ' ml';
					}
				},
				data: [
					2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
				]
			},
			{
				name: 'Precipitation',
				type: 'bar',
				tooltip: {
					valueFormatter: function (value) {
						return value + ' ml';
					}
				},
				data: [
					2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
				]
			},
			{
				name: 'Temperature',
				type: 'line',
				yAxisIndex: 1,
				tooltip: {
					valueFormatter: function (value) {
						return value + ' °C';
					}
				},
				data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
			}
		]
	},
	pie: {
		legend: {
			top: 'bottom'
		},
		toolbox: {
			show: true,
			feature: {
				mark: { show: true },
				dataView: { show: true, readOnly: false },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		series: [
			{
				name: 'Nightingale Chart',
				type: 'pie',
				radius: [50, 250],
				center: ['50%', '50%'],
				roseType: 'area',
				itemStyle: {
					borderRadius: 8
				},
				data: [
					{ value: 40, name: 'rose 1' },
					{ value: 38, name: 'rose 2' },
					{ value: 32, name: 'rose 3' },
					{ value: 30, name: 'rose 4' },
					{ value: 28, name: 'rose 5' },
					{ value: 26, name: 'rose 6' },
					{ value: 22, name: 'rose 7' },
					{ value: 18, name: 'rose 8' }
				]
			}
		]
	},
	sca: {
		xAxis: {},
		yAxis: {},
		series: [
			{
				symbolSize: 20,
				data: [
					[10.0, 8.04],
					[8.07, 6.95],
					[13.0, 7.58],
					[9.05, 8.81],
					[11.0, 8.33],
					[14.0, 7.66],
					[13.4, 6.81],
					[10.0, 6.33],
					[14.0, 8.96],
					[12.5, 6.82],
					[9.15, 7.2],
					[11.5, 7.2],
					[3.03, 4.23],
					[12.2, 7.83],
					[2.02, 4.47],
					[1.05, 3.33],
					[4.05, 4.96],
					[6.03, 7.24],
					[12.0, 6.26],
					[12.0, 8.84],
					[7.08, 5.82],
					[5.02, 5.68]
				],
				type: 'scatter'
			}
		]
	},
	gau: {
		series: [
			{
				type: 'gauge',
				progress: {
					show: true,
					width: 18
				},
				axisLine: {
					lineStyle: {
						width: 18
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					length: 15,
					lineStyle: {
						width: 2,
						color: '#999'
					}
				},
				axisLabel: {
					distance: 25,
					color: '#999',
					fontSize: 20
				},
				anchor: {
					show: true,
					showAbove: true,
					size: 25,
					itemStyle: {
						borderWidth: 10
					}
				},
				title: {
					show: false
				},
				detail: {
					valueAnimation: true,
					fontSize: 80,
					offsetCenter: [0, '70%']
				},
				data: [
					{
						value: 70
					}
				]
			}
		]
	},
}