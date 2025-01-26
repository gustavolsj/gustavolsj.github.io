---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /dataloggers/
---

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>chartjs-plugin-datasource sample</title>
	<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datasource@0.1.0"></script>
	<style>
		canvas {
			-moz-user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
		}

    	.chart {
    		margin: auto;
    		margin-left:-80px
    		width: 155%;
    	}

    	.text-center {
    		text-align: center;
    	}
    </style>

</head>

<body>
	<div class="chart">
		<canvas id="myChart"></canvas>
	</div>

    <script>
    	var chartColors = {
    		red: 'rgb(255, 99, 132)',
    		blue: 'rgb(54, 162, 235)'
    	};

    	var color = Chart.helpers.color;
    	var config = {
    		type: 'line',
    		data: {
    			datasets: [{
    				type: 'line',
    				yAxisID: 'temperature',
    				backgroundColor: 'transparent',
    				borderColor: chartColors.red,
    				pointBackgroundColor: chartColors.red,
    				tension: 0,
    				fill: false
    			}, {
    				yAxisID: 'precipitation',
    				backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
    				borderColor: 'transparent'
    			}]
    		},
    		plugins: [ChartDataSource],
    		options: {
    			title: {
    				display: true,
    				text: 'CSV data source (index) sample'
    			},
    			scales: {
    				xAxes: [{
    					scaleLabel: {
    						display: true,
    						labelString: 'Month'
    					}
    				}],
    				yAxes: [{
    					id: 'temperature',
    					gridLines: {
    						drawOnChartArea: false
    					},
    					scaleLabel: {
    						display: true,
    						labelString: 'Temperature (°C)'
    					}
    				}, {
    					id: 'precipitation',
    					position: 'right',
    					gridLines: {
    						drawOnChartArea: false
    					},
    					scaleLabel: {
    						display: true,
    						labelString: 'Precipitation (mm)'
    					}
    				}]
    			},
    			plugins: {
    				datasource: {
    					type: 'csv',
    					url: '../datos.csv',
    					delimiter: ',',
    					rowMapping: 'index',
    					datasetLabels: true,
    					indexLabels: true
    				}
    			}
    		}
    	};

    	window.onload = function () {
    		var ctx = document.getElementById('myChart').getContext('2d');
    		window.myChart = new Chart(ctx, config);
    	};
    </script>

</body>
