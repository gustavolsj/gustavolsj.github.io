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
    <button onclick="filtrarFilas(50)">Últimos 50</button>
    <button onclick="filtrarFilas(500)">Últimos 500</button>
    <button onclick="filtrarFilas(5000)">Últimos 5000</button>
    <button onclick="filtrarFilas('todos')">Todos</button>
  </div>

<canvas id="myChart"></canvas>

  <script>
    var chartColors = {
      red: 'rgb(255, 99, 132)',
      blue: 'rgb(54, 162, 235)'
    };

    var color = Chart.helpers.color;

    var config = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Temperatura',
          yAxisID: 'temperatura',
          backgroundColor: 'transparent',
          borderColor: chartColors.red,
          pointBackgroundColor: chartColors.red,
          tension: 0,
          fill: false,
          data: []
        }, {
          label: 'Humedad',
          yAxisID: 'humedad',
          backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
          borderColor: 'transparent',
          data: []
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

      // Esperar a que se carguen los datos del CSV
      setTimeout(() => {
        filtrarFilas(500); // Vista por defecto
      }, 1000);
    };

    function filtrarFilas(cantidad) {
      const chart = window.myChart;
      const labels = chart.data.labels;
      const datasets = chart.data.datasets;

      let startIndex = 0;
      if (cantidad !== 'todos') {
        startIndex = Math.max(0, labels.length - cantidad);
      }

      const nuevasLabels = labels.slice(startIndex);
      const nuevosDatasets = datasets.map(ds => ({
        ...ds,
        data: ds.data.slice(startIndex)
      }));

      chart.data.labels = nuevasLabels;
      chart.data.datasets = nuevosDatasets;
      chart.update();
    }
  </script>

</body>
