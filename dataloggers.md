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
    	.myChart {
    	}
    	.chart {
    		margin-left: 0px;
			width: 155%;
			height:	155%;
    	}
    	.text-center {
    		text-align: center;
		}
    </style>
</head>

<body>
	<div>
 		<iframe src="https://gustavolsj.github.io/tabla.html" name="ifrm" width="900" height="200" frameborder="0"> </iframe>
	</div>

    <div class="chart">
    	<canvas id="myChart" style="margin-left:-200px"></canvas>
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
					yAxisID: 'temperatura',
					backgroundColor: 'transparent',
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					tension: 0,
					fill: false
				}, {
					yAxisID: 'humedad',
					backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
					borderColor: 'transparent'
				}]
			},
			plugins: [ChartDataSource],
			options: {
				title: {
					display: true,
					text: 'Datalogger SHT31: temperatura y humedad relativa'
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Fecha'
						}
					}],
					yAxes: [{
						id: 'temperatura',
						gridLines: {
							drawOnChartArea: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Temperatura (°C)'
						}
					}, {
						id: 'humedad',
						position: 'right',
						gridLines: {
							drawOnChartArea: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Humedad (%)'
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
