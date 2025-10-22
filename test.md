---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /test/
---

<!-- ✅ Modernizado para Chart.js v4 y carga JSON vía fetch -->

<head>
  <meta charset="utf-8" />
  <title>Datalogger SHT31</title>
  <!-- Chart.js v4 -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    canvas {
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }

    .chart-container {
      position: relative;
      width: 100%;
      max-width: 900px;
      margin: 20px auto;
    }

    .text-center {
      text-align: center;
    }

    iframe {
      display: block;
      margin: 0 auto 20px auto;
      border: none;
    }
  </style>
</head>

<body>
  <div class="text-center">
    <iframe src="https://gustavolsj.github.io/tabla.html" width="900" height="200"></iframe>
  </div>

  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>

  <script>
    async function cargarDatos() {
      try {
        // 🔹 1. Cargar el JSON remoto
        const response = await fetch('https://gustavolsj.github.io/datos.json');
        const data = await response.json();

        // 🔹 2. Filtrar los últimos 1500 registros (igual que antes)
        const ultimos = data.slice(-1500);

        // 🔹 3. Extraer campos
        const labels = ultimos.map(d => d.fecha || d.Fecha || d.time || ''); // Ajusta según tu JSON
        const temperaturas = ultimos.map(d => parseFloat(d.temperatura || d.temp || d.Temperatura || 0));
        const humedades = ultimos.map(d => parseFloat(d.humedad || d.Humedad || d.hum || 0));

        // 🔹 4. Crear el gráfico
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Temperatura (°C)',
                data: temperaturas,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                yAxisID: 'y1',
                tension: 0.2,
                fill: false
              },
              {
                label: 'Humedad (%)',
                data: humedades,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                yAxisID: 'y2',
                tension: 0.2,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false
            },
            stacked: false,
            plugins: {
              title: {
                display: true,
                text: 'Datalogger SHT31: Temperatura y Humedad Relativa'
              },
              legend: {
                position: 'top'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Fecha'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Temperatura (°C)'
                }
              },
              y2: {
                type: 'linear',
                display: true,
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
        });

      } catch (error) {
        console.error('Error al cargar o procesar los datos:', error);
        const canvas = document.getElementById('myChart');
        canvas.outerHTML = `<p style="color:red;text-align:center;">Error al cargar los datos del JSON.</p>`;
      }
    }

    // Ejecutar cuando cargue la página
    window.onload = cargarDatos;
  </script>
</body>
