---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /dataloggers/
---

<head>
  <meta charset="UTF-8">
  <title>Gráfica de Temperatura y Humedad</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datasource@0.1.0"></script>
</head>
<body>
  <h2>Gráfica de Temperatura y Humedad</h2>
  <canvas id="myChart" width="400" height="200"></canvas>

  <script>

    async function renderChart() {
      const { labels, temperaturas, humedades } = await fetchData();

      const ctx = document.getElementById('myChart').getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura',
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true
            },
            {
              label: 'Humedad',
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true
            }
          ]
        },
		plugins: [ChartDataSource],
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Fecha'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Valores'
              }
            }
          }
        }
        plugins: {
            datasource: {
                url: 'datos.csv'
            }
        }
      });
    }

    renderChart();
  </script>
</body>
