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
			height:	155%
    	}
    	.text-center {
    		text-align: center;
		}
		
  table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border-bottom: 1px solid;
      padding: 8px;
      text-align: center;
    }

    th {
      font-weight: bold;
      border-left: none;
      border-right: none;
      border-top: none;
    }

    td {
      border-left: none;
      border-right: none;
    }


    </style>

</head>

<body>
	<div id="tabla">
	<table border="1">
		<thead>
		<tr>
			<th>Última Fecha</th>
			<th>Temperatura Mínima</th>
			<th>Temperatura Máxima</th>
			<th>Temperatura Promedio</th>
			<th>Humedad Mínima</th>
			<th>Humedad Máxima</th>
			<th>Humedad Promedio</th>
		</tr>
		</thead>
		<tbody id="tabla-resumen"></tbody>
	</table>
	</div>

    <script>
    	fetch('datos.csv')
    	.then(response => response.text())
    	.then(csv => {
    		const lineas = csv.trim().split('\n').slice(1); // Ignora encabezado
    		const fechas = [];
    		const temperaturas = [];
    		const humedades = [];

    		lineas.forEach(linea => {
    		const partes = linea.split(',');
    		if (partes.length === 3) {
    			const fecha = partes[0].trim();
    			const temp = parseFloat(partes[1]);
    			const hum = parseFloat(partes[2]);

    			fechas.push(fecha);
    			temperaturas.push(temp);
    			humedades.push(hum);
    		}
    		});

    		const ultimaFecha = fechas[fechas.length - 1];
    		const tempMin = Math.min(...temperaturas);
    		const tempMax = Math.max(...temperaturas);
    		const tempProm = (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(2);

    		const humMin = Math.min(...humedades);
    		const humMax = Math.max(...humedades);
    		const humProm = (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(2);

    		const fila = `
    		<tr>
    			<td>${ultimaFecha}</td>
    			<td>${tempMin} °C</td>
    			<td>${tempMax} °C</td>
    			<td>${tempProm} °C</td>
    			<td>${humMin} %</td>
    			<td>${humMax} %</td>
    			<td>${humProm} %</td>
    		</tr>
    		`;

    		document.getElementById('tabla-resumen').innerHTML = fila;
    	})
    	.catch(error => console.error('Error al cargar datos.csv:', error));
    </script>

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
