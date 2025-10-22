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

  <!-- Bootstrap (para estilos de la tabla integrada) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css">

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

    /* Estilos para la tabla de resumen integrada */
    table { border-collapse: collapse; width: auto; margin-bottom: 1rem; }
    th, td { border-bottom: 1px solid; padding: 8px; text-align: center; }
    th { font-weight: bold; border-left: none; border-right: none; border-top: none; }
    td { border-left: none; border-right: none; }

    /* Ajustes responsivos menores */
    .table-sm { max-width: 900px; margin: 0 auto 1rem; }
    .container h2 { text-align: center; margin-top: 1rem; }
  </style>
</head>

<body>
  <div class="text-center">
    <!-- Reemplazado: el iframe fue sustituido por la tabla HTML integrada más abajo -->
  </div>

  <!-- Tabla de resumen (integrada en la página en lugar del iframe) -->
  <div class="container">
    <h2>Resumen de datos climáticos</h2>

    <table class="table table-sm" border="1">
      <thead class="thead-light">
        <tr>
          <th># de mediciones</th>
          <th>Última medición</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td id="totalLineas">—</td>
          <td id="ultimaFecha">—</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-sm" border="1">
      <thead>
        <tr>
          <th>T mín</th>
          <th>T máx</th>
          <th>T promedio</th>
          <th>HR mín</th>
          <th>HR máx</th>
          <th>HR promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td id="tempMin">— °C</td>
          <td id="tempMax">— °C</td>
          <td id="tempProm">— °C</td>
          <td id="humMin">— %</td>
          <td id="humMax">— %</td>
          <td id="humProm">— %</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>

  <script>
    async function cargarDatos() {
      try {
        // 🔹 1. Cargar el JSON remoto (usar ruta absoluta para evitar problemas de ruta)
        const response = await fetch('https://gustavolsj.github.io/datos.json');
        const data = await response.json();

        // 🔹 2. Filtrar los últimos 1500 registros (igual que antes)
        const ultimos = data.slice(-1500);

        // 🔹 3. Extraer campos
        const labels = ultimos.map(d => d.fecha || d.Fecha || d.time || d.fecha_hora || ''); // Ajusta según tu JSON
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
        if (canvas) {
          canvas.outerHTML = `<p style="color:red;text-align:center;">Error al cargar los datos del JSON.</p>`;
        }
      }
    }

    // --------------------------
    // Script para la tabla de resumen
    // --------------------------
    function parseNumber(v) {
      if (v === null || v === undefined) return NaN;
      return parseFloat(String(v).trim().replace(',', '.'));
    }

    async function cargarTabla() {
      try {
        // Usar ruta absoluta consistente con el gráfico
        const resp = await fetch('https://gustavolsj.github.io/datos.json');
        if (!resp.ok) throw new Error('Error al cargar datos.json: ' + resp.status);
        const json = await resp.json();

        // Acepta tanto un array directo como { data: [...] }
        const registros = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
        const fechas = [];
        const temperaturas = [];
        const humedades = [];

        registros.forEach(r => {
          // tu JSON usa: "fecha_hora", "temperatura", "humedad"
          const fecha = r['fecha_hora'] ?? r['fecha'] ?? r['date'] ?? r['time'] ?? '';
          const tempRaw = r['temperatura'] ?? r['temp'] ?? r['temperature'];
          const humRaw = r['humedad'] ?? r['hum'] ?? r['humidity'];

          const temp = parseNumber(tempRaw);
          const hum = parseNumber(humRaw);

          fechas.push(fecha ? String(fecha).trim() : '');

          if (!Number.isNaN(temp)) temperaturas.push(temp);
          if (!Number.isNaN(hum)) humedades.push(hum);
        });

        const totalLineas = registros.length;
        // tomar la última fecha no vacía (asume que el JSON está en orden cronológico)
        const fechasValidas = fechas.filter(f => f && f.length);
        const ultimaFecha = fechasValidas.length ? fechasValidas[fechasValidas.length - 1] : '—';

        function safeMin(arr) { return arr.length ? Math.min(...arr) : null; }
        function safeMax(arr) { return arr.length ? Math.max(...arr) : null; }
        function safeProm(arr) { return arr.length ? (arr.reduce((a,b) => a + b, 0) / arr.length) : null; }

        const tempMin = safeMin(temperaturas);
        const tempMax = safeMax(temperaturas);
        const tempProm = safeProm(temperaturas);

        const humMin = safeMin(humedades);
        const humMax = safeMax(humedades);
        const humProm = safeProm(humedades);

        // Actualiza DOM
        document.getElementById("totalLineas").textContent = totalLineas;
        document.getElementById("ultimaFecha").textContent = ultimaFecha;

        document.getElementById("tempMin").textContent = tempMin !== null ? tempMin.toFixed(2) + ' °C' : '— °C';
        document.getElementById("tempMax").textContent = tempMax !== null ? tempMax.toFixed(2) + ' °C' : '— °C';

        document.getElementById("tempProm").textContent = tempProm !== null ? tempProm.toFixed(2) + ' °C' : '— °C';

        document.getElementById("humMin").textContent = humMin !== null ? humMin.toFixed(2) + ' %' : '— %';
        document.getElementById("humMax").textContent = humMax !== null ? humMax.toFixed(2) + ' %' : '— %';
        document.getElementById("humProm").textContent = humProm !== null ? humProm.toFixed(2) + ' %' : '— %';
      } catch (err) {
        console.error(err);
        const tl = document.getElementById("totalLineas");
        const uf = document.getElementById("ultimaFecha");
        if (tl) tl.textContent = 'Error';
        if (uf) uf.textContent = 'Error';
      }
    }

    // Ejecutar cuando cargue la página: correr ambos cargadores
    window.onload = function() {
      cargarDatos();
      cargarTabla();
    };
  </script>
</body>
