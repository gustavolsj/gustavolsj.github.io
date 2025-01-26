---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /dataloggers/
---


<head>
  <meta charset="UTF-8">
  <title>Gráfica de Temperatura y Humedad</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h2>Gráfica de Temperatura y Humedad</h2>
  <canvas id="myChart" width="400" height="200"></canvas>

  <script>
    async function fetchData() {
      const response = await fetch('http://gusapps.zapto.org:8080/chart.php');
      const data = await response.json();

      const labels = data.map(row => row.fecha_hora);
      const temperaturas = data.map(row => row.temperatura);
      const humedades = data.map(row => row.humedad);

      return { labels, temperaturas, humedades };
    }

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
              data: temperaturas,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true
            },
            {
              label: 'Humedad',
              data: humedades,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true
            }
          ]
        },
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
      });
    }

    renderChart();
  </script>
</body>
