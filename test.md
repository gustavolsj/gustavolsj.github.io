---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /test/
---

<div id="cargando">Cargando datos...</div>

<div id="botones">
  <button onclick="filtrarFilas(50)">Últimos 50</button>
  <button onclick="filtrarFilas(500)">Últimos 500</button>
  <button onclick="filtrarFilas(5000)">Últimos 5000</button>
  <button onclick="filtrarFilas('todos')">Todos</button>
</div>

<canvas id="myChart"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datasource@0.1.0"></script>

<script>
  const chartColors = {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)'
  };

  const config = {
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
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'transparent',
        data: []
      }]
    },
    plugins: [ChartDataSource],
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Datalogger SHT31: temperatura y humedad relativa'
        },
        datasource: {
          type: 'csv',
          url: '../datos.csv',
          delimiter: ',',
          rowMapping: 'index',
          datasetLabels: true,
          indexLabels: true
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        temperatura: {
          position: 'left',
          title: {
            display: true,
            text: 'Temperatura (°C)'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        humedad: {
          position: 'right',
          title: {
            display: true,
            text: 'Humedad (%)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  };

  window.onload = function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    window.myChart = new Chart(ctx, config);
    esperarDatosYFiltrar(500); // Vista por defecto
  };

  function esperarDatosYFiltrar(cantidad) {
    const cargando = document.getElementById('cargando');
    const intervalo = setInterval(() => {
      const chart = window.myChart;
      const labels = chart.data.labels;
      const datasets = chart.data.datasets;

      if (labels.length > 0 && datasets.every(ds => ds.data.length > 0)) {
        clearInterval(intervalo);
        cargando.style.display = 'none';
        filtrarFilas(cantidad);
      }
    }, 200);
  }

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

<style>
  #botones {
    margin-bottom: 20px;
  }

  #botones button {
    margin-right: 10px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
  }

  #botones button:hover {
    background-color: #0056b3;
  }

  #cargando {
    font-style: italic;
    color: #555;
    margin-bottom: 10px;
  }

  canvas {
    max-width: 100%;
  }
</style>
