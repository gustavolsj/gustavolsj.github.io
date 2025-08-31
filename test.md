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

  let datosOriginales = {
    labels: [],
    datasets
