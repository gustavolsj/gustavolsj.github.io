---
layout: page
title: Dataloggers y otros proyectos maker
permalink: /dataloggers/
---

<head>
  <base target="_top">
  <script src="https://www.gstatic.com/charts/loader.js"></script>

  <script>
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
      'packages': ['corechart']
    });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      google.script.run.withSuccessHandler(displayChart).getChartData();
    }

    function displayChart(data) {
      var chartData = google.visualization.arrayToDataTable(data);

      // Set chart options
      var options = {
        title: 'Sales Data Visualization',
        is3D: true
        // Additional chart options
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
      chart.draw(chartData, options);
    }
  </script>
</head>

<body>
  <!--Div that will hold the pie chart-->
  <div id="pie_chart" style="width: 50%; height: 400px;"></div>
  <iframe
    src="https://script.google.com/macros/s/AKfycbxcCKHVBXP8gerUcszrHLn23QwT68Tv4-98VkTmwgjdtSQFj1yfiteW_-sopTNdwO-oUA/exec"
    height="500" width="50%"></iframe>
</body>
