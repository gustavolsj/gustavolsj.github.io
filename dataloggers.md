---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /dataloggers/
---

<!-- ✅ Modernizado para Chart.js v4 y carga JSON vía  fetch -->

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
  <div class="container">
<table class="table table-sm" border="1">
  <thead class="thead-light">
    <tr>
      <th>Estado</th>
      <th># de mediciones</th>
      <th>Última medición</th>
      <th>TWPI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id="estatus">—</td>
      <td id="totalLineas">—</td>
      <td id="ultimaFecha">—</td>
      <td id="twpiResumen">—</td>
    </tr>
  </tbody>
</table>
    <table class="table table-sm" border="1">
      <thead>
        <tr>
          <th colspan="5">T °C</th>
          <th colspan="5">HR %</th>
        </tr>
        <tr>
          <th>mín</th>
          <th>máx</th>
          <th>prom</th>
          <th>mediana</th>
          <th>desv. est.</th>
          <th>mín</th>
          <th>máx</th>
          <th>prom</th>
          <th>mediana</th>
          <th>desv. est.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td id="tempMin">—</td>
          <td id="tempMax">—</td>
          <td id="tempProm">—</td>
          <td id="tempMediana">—</td>
          <td id="tempDesv">—</td>
          <td id="humMin">—</td>
          <td id="humMax">—</td>
          <td id="humProm">—</td>
          <td id="humMediana">—</td>
          <td id="humDesv">—</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-sm" border="1">
      <thead>
        <tr>
          <th>Rango</th>
          <th>Temperatura</th>
          <th>Humedad</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>% < límite inferior</td>
          <td id="tempBajo">—</td>
          <td id="humBaja">—</td>
        </tr>
        <tr>
          <td>% dentro del rango</td>
          <td id="tempMedio">—</td>
          <td id="humMedia">—</td>
        </tr>
        <tr>
          <td>% > límite superior</td>
          <td id="tempAlto">—</td>
          <td id="humAlta">—</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>

<div id="nuevo" class="row">
  <div class="col-12 col-md-6">
    <p>
      La grafica que ves arriba muestra en tiempo real los datos de temperatura y humedad relativa que mi datalogger está midiendo en este mismo momento, en la tabla superior se muestra tambien el estado del datalogger -si está en linea o no- así como un resumen de las estadísticas más relevantes, incluyendo el cálculo del <a href="https://www.padfield.org/tim/cfys/twpi/twpi_02.html">TWPI</a> un parametro que se expresa en años y que resume el desempeño de un espacio que es utilizado para la conservación de fotografías.
      <br><br>
      Un datalogger es un aparato indispensable en la conservación de bienes culturales que mide, almacena y muestra los valores de algunos agentes de deterioro a lo largo del tiempo; los más comunes son la humedad relativa y la temperatura, aunque algunos dataloggers cuentan con sensores de radiación visible y ultravioleta, o de contaminantes gaseosos y partículas sólidas. Existen marcas y modelos de dataloggers especiales para la conservación de gran calidad, pero que no son accesibles a muchas instituciones en Latinoamérica debido a su alto costo.
      <br><br>
      Por eso me interesó construir mi propio datalogger usando componentes electrónicos y programación. El resultado es un dispositivo accesible, confiable y sostenible, cuyo desempeño se ubica al mismo nivel que los dataloggers comerciales, con un costo mucho menor (alrededor de $800 pesos mexicanos).
      <br><br>
      Para fabricar el tuyo puedes seguir esta <a href="https://github.com/gustavolsj/datalogger-conservacion" target="_blank" rel="noopener noreferrer">guía</a>.
    </p>
  </div>

  <div class="col-12 col-md-6 text-center">
    <img
      src="/images/datalogger_wifi.jpg"
      alt="Datalogger de conservación basado en SHT31"
      class="img-fluid"
      style="max-height: 550px; object-fit: contain;"
    >
  </div>
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

        // Helpers: parse dd/mm/yyyy[ HH:mm[:ss]] and format "now" as dd/mm/yyyy HH:mm:ss
        function parseDMY(s) {
          if (!s) return null;
          const cleaned = String(s).trim().replace(/\s+/g, ' ');
          // accept an optional stray slash after the year: dd/mm/yyyy/ HH:mm
          const m = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\/?(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
          if (!m) {
            const d = new Date(cleaned);
            return isNaN(d) ? null : d;
          }
          const day = parseInt(m[1], 10);
          const month = parseInt(m[2], 10) - 1;
          let year = parseInt(m[3], 10);
          if (year < 100) year += 2000;
          const hour = m[4] ? parseInt(m[4], 10) : 0;
          const minute = m[5] ? parseInt(m[5], 10) : 0;
          const second = m[6] ? parseInt(m[6], 10) : 0;
          return new Date(year, month, day, hour, minute, second);
        }
        function pad2(n){ return String(n).padStart(2,'0'); }
        function nowDMYString() {
          const d = new Date();
          return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
        }

        // 🔹 Calculate time difference and determine online/offline status (using DMY for both dates)
        let statusImage = '';
        if (ultimaFecha !== '—') {
          try {
            // normalize the last date string to remove a stray slash after the year
            const lastDateStrClean = String(ultimaFecha).trim()
              .replace(/\s+/g, ' ')
              .replace(/^(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\/\s/, '$1 ');

            const lastDate = parseDMY(lastDateStrClean);          // keep last date as DMY
            const currentDateStr = nowDMYString();                // adjust current date to DMY string
            const currentDate = parseDMY(currentDateStr);         // parse with same DMY rules

            if (!lastDate || isNaN(lastDate) || !currentDate || isNaN(currentDate)) {
              throw new Error('Fecha inválida al comparar (lastDate/currentDate)');
            }

            const diffInMilliseconds = currentDate - lastDate;
            const diffInMinutes = diffInMilliseconds / (1000 * 60);

/*             // 🔍 Debug logging
            console.log('=== DATALOGGER STATUS DEBUG (DMY aligned) ===');
            console.log('Last date string (raw):', ultimaFecha);
            console.log('Last date string (clean):', lastDateStrClean);
            console.log('Current date string (DMY adjusted):', currentDateStr);
            console.log('Last date parsed:', lastDate);
            console.log('Current date parsed:', currentDate);
            console.log('Difference in milliseconds:', diffInMilliseconds);
            console.log('Formula: (currentDate - lastDate) / (1000 * 60)');
            console.log('Difference in minutes:', diffInMinutes.toFixed(2));
            console.log('Threshold: 65 minutes');
            console.log('Condition: diffInMinutes > 65 ?', diffInMinutes > 65); */

            if (diffInMinutes > 65) {
              console.log('Result: OFFLINE (difference > 65 minutes)');
              statusImage = '<img src="/images/cloud-offline.png" alt="Offline" style="width: 44px; height: 44px; margin-left: 8px;">';
            } else {
              console.log('Result: ONLINE (difference ≤ 65 minutes)');
              statusImage = '<img src="/images/cloud-online.png" alt="Online" style="width: 44px; height: 44px; margin-left: 8px;">';
            }
            console.log('=============================================');
          } catch (dateError) {
            console.error('Error comparing dates:', dateError, 'ultimaFecha:', ultimaFecha);
          }
        } else {
          console.log('No valid last date found (ultimaFecha = "—")');
        }

        function safeMin(arr) { return arr.length ? Math.min(...arr) : null; }
        function safeMax(arr) { return arr.length ? Math.max(...arr) : null; }
        function safeProm(arr) { return arr.length ? (arr.reduce((a,b) => a + b, 0) / arr.length) : null; }
        
        function safeMediana(arr) {
          if (!arr.length) return null;
          const sorted = [...arr].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        }
        
        function safeDesviacion(arr) {
          if (arr.length < 2) return null;
          const promedio = arr.reduce((a,b) => a + b, 0) / arr.length;
          const varianza = arr.reduce((a,b) => a + Math.pow(b - promedio, 2), 0) / arr.length;
          return Math.sqrt(varianza);
        }

        function calcularPorcentajes(arr, limite1, limite2) {
          if (!arr.length) return { bajo: '—', medio: '—', alto: '—' };
          const bajo = arr.filter(v => v < limite1).length;
          const medio = arr.filter(v => v >= limite1 && v <= limite2).length;
          const alto = arr.filter(v => v > limite2).length;
          const total = arr.length;
          return {
            bajo: ((bajo / total) * 100).toFixed(1) + '%',
            medio: ((medio / total) * 100).toFixed(1) + '%',
            alto: ((alto / total) * 100).toFixed(1) + '%'
          };
        }

        const tempMin = safeMin(temperaturas);
        const tempMax = safeMax(temperaturas);
        const tempProm = safeProm(temperaturas);
        const tempMediana = safeMediana(temperaturas);
        const tempDesv = safeDesviacion(temperaturas);

        const humMin = safeMin(humedades);
        const humMax = safeMax(humedades);
        const humProm = safeProm(humedades);
        const humMediana = safeMediana(humedades);
        const humDesv = safeDesviacion(humedades);

        // Actualiza DOM (sin necesidad de usar lastDate directamente)
        document.getElementById("estatus").innerHTML = statusImage;
        document.getElementById("totalLineas").textContent = totalLineas;
        document.getElementById("ultimaFecha").textContent = ultimaFecha;

        document.getElementById("tempMin").textContent = tempMin !== null ? tempMin.toFixed(0) : '—';
        document.getElementById("tempMax").textContent = tempMax !== null ? tempMax.toFixed(0) : '—';
        document.getElementById("tempProm").textContent = tempProm !== null ? tempProm.toFixed(0) : '—';
        document.getElementById("tempMediana").textContent = tempMediana !== null ? tempMediana.toFixed(0) : '—';
        document.getElementById("tempDesv").textContent = tempDesv !== null ? tempDesv.toFixed(2) : '—';

        document.getElementById("humMin").textContent = humMin !== null ? humMin.toFixed(0) : '—';
        document.getElementById("humMax").textContent = humMax !== null ? humMax.toFixed(0) : '—';
        document.getElementById("humProm").textContent = humProm !== null ? humProm.toFixed(0) : '—';
        document.getElementById("humMediana").textContent = humMediana !== null ? humMediana.toFixed(0) : '—';
        document.getElementById("humDesv").textContent = humDesv !== null ? humDesv.toFixed(2) : '—';

        // Calcular porcentajes por rangos
        const tempRanges = calcularPorcentajes(temperaturas, 21, 24);
        const humRanges = calcularPorcentajes(humedades, 40, 50);

        document.getElementById("tempBajo").textContent = tempRanges.bajo;
        document.getElementById("tempMedio").textContent = tempRanges.medio;
        document.getElementById("tempAlto").textContent = tempRanges.alto;

        document.getElementById("humBaja").textContent = humRanges.bajo;
        document.getElementById("humMedia").textContent = humRanges.medio;
        document.getElementById("humAlta").textContent = humRanges.alto;
        } catch (err) {
          console.error(err);
          const tl = document.getElementById("totalLineas");
          const uf = document.getElementById("ultimaFecha");
          if (tl) tl.textContent = 'Error';
          if (uf) uf.textContent = 'Error';
        }
    }
	
	function calcPI(tCelsius, rh, metodo) {
	  const tKelvin = parseFloat(tCelsius) + 273.15;
	  rh = parseFloat(rh);
	  const R = 8.314;
	  let years;

	  if (metodo === 'IPI') {
		years = Math.exp((95220 - 134.9 * rh) / (R * tKelvin) + (0.0284 * rh) - 28.023) / 360;
	  } else if (metodo === 'TP') {
		// Debug: descomponer la fórmula TP en componentes
		years = 1.0 / (rh * 5.9e12 * Math.exp(-90300 / (R * tKelvin)));
	  }

	  const rate = 1.0 / years;
	  return { rate, years };
	}

async function calcularTWPI() {
	  try {
		const resp = await fetch('https://gustavolsj.github.io/datos.json');
		const json = await resp.json();
		const registros = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);

		let acumuladoIPI = 0;
		let acumuladoTP = 0;
		let total = 0;

		registros.forEach(r => {
		  const tempRaw = r['temperatura'] ?? r['temp'] ?? r['temperature'];
		  const humRaw = r['humedad'] ?? r['hum'] ?? r['humidity'];

		  const t = parseNumber(tempRaw);
		  const rh = parseNumber(humRaw);

		  if (!Number.isNaN(t) && !Number.isNaN(rh)) {
			const ipi = calcPI(t, rh, 'IPI');
			const tp = calcPI(t, rh, 'TP');
			acumuladoIPI += ipi.rate;
			acumuladoTP += tp.rate;
			total++;
		  }
		});

		const twpiIPI = total && acumuladoIPI ? Math.round(total / acumuladoIPI) : '—';
		const twpiTP = total && acumuladoTP ? Math.round(total / acumuladoTP) : '—';

		// document.getElementById("twpiResumen").textContent = `${twpiIPI} / ${twpiTP} años`;
		document.getElementById("twpiResumen").textContent = `${twpiIPI} años`;
	  } catch (err) {
		console.error("Error al calcular TWPI:", err);
		document.getElementById("twpiResumen").textContent = 'Error';
	  }
	}

    // Ejecutar cuando cargue la página: correr ambos cargadores
    window.onload = function() {
      cargarDatos();
      cargarTabla();
      calcularTWPI();

    };
  </script>
</body>
