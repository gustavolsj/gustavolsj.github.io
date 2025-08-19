---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /test/
---

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>chartjs-plugin-datasource sample</title>
	
	<style>
	
		.tabla{
			width: 155%;
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
				<th>Fecha</th>
				<th>T mín</th>
				<th>T máx</th>
				<th>T prom</th>
				<th>HR mín</th>
				<th>HR máx</th>
				<th>HR prom</th>
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

</body>
