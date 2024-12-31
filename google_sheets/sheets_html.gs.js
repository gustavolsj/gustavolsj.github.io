//TUTORIAL PARA GENERAR UN INDEX A PARTIR DE GOOGLE SHEETS DATA  https://www.bpwebs.com/visualize-google-sheets-data-in-html-charts/

/* function doGet(request) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getChartData(){
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const data = ss.getDataRange().getValues();

  return data;
} */


function doGet(request) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getChartData(){
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja 1");
  const data = ss.getDataRange().getValues();

  return data;
}