---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /test/
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

<div id="botones">
  <button onclick="filtrarRango('dia')">1 Día</button>
  <button onclick="filtrarRango('semana')">1 Semana</button>
  <button onclick="filtrarRango('mes')">1 Mes</button>
  <button onclick="filtrarRango('anio')">1 Año</button>
</div>
<canvas id="myChart"></canvas>

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


        function filtrarRango(rango) {
            const diasPorRango = {
                dia: 1,
                semana: 7,
                mes: 30,
                anio: 365
            };

            const dias = diasPorRango[rango];
            const hoy = new Date();

            // Filtrar los datos del CSV ya cargado
            const datasets = window.myChart.data.datasets;
            const labels = window.myChart.data.labels;

            const fechaLimite = new Date(hoy);
            fechaLimite.setDate(hoy.getDate() - dias);

            // Filtrar etiquetas y datos
            const nuevasLabels = [];
            const nuevosDatasets = datasets.map(ds => ({
                ...ds,
                data: []
            }));

            labels.forEach((label, i) => {
                const fecha = new Date(label);
                if (fecha >= fechaLimite) {
                    nuevasLabels.push(label);
                    nuevosDatasets.forEach((ds, idx) => {
                        ds.data.push(datasets[idx].data[i]);
                    });
                }
            });

            window.myChart.data.labels = nuevasLabels;
            window.myChart.data.datasets = nuevosDatasets;
            window.myChart.update();
        }

		window.onload = function () {
			var ctx = document.getElementById('myChart').getContext('2d');
			window.myChart = new Chart(ctx, config);
            
            filtrarRango('semana');
		};
	</script>

</body>
