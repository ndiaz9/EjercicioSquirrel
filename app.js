const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";
const tablaEvents = document.getElementById("table-events");
const tablaCorrelations = document.getElementById("table-correlations");

function fillEventTable(data) {
  data.forEach((element, index) => {
    let row = tablaEvents.insertRow();
    let num = row.insertCell(0);
    num.innerHTML = index + 1;
    let event = row.insertCell(1);
    event.innerHTML = element.events;
    let squirrel = row.insertCell(2);
    squirrel.innerHTML = element.squirrel;
    if (element.squirrel == true) {
      row.style = "background-color : #f08080";
    }
  });
}

function fillCorrelationTable(correlations) {
  correlations.forEach((element, index) => {
    let row = tablaCorrelations.insertRow();
    let num = row.insertCell(0);
    num.innerHTML = index + 1;
    let event = row.insertCell(1);
    event.innerHTML = element.Evento;
    let correlation = row.insertCell(2);
    correlation.innerHTML = element.MCC;
  });
}

let getEvents = (data) => {
  let ans = [];
  data.forEach((element) => {
    let current = element.events;
    current.forEach((event) => {
      if (!ans.includes(event)) {
        ans.push(event);
      }
    });
  });
  return ans;
};

let getCorrelations = (data, events) => {
  let ans = [];
  events.forEach((event) => {
    confusionMatrix = { Evento: event, TN: 0, TP: 0, FN: 0, FP: 0, MCC: 0 };
    data.forEach((element) => {
      if (element.events.includes(event)) {
        if (element.squirrel == true) {
          confusionMatrix.TP += 1;
        } else {
          confusionMatrix.FN += 1;
        }
      } else {
        if (element.squirrel == true) {
          confusionMatrix.FP += 1;
        } else {
          confusionMatrix.TN += 1;
        }
      }
    });
    confusionMatrix.MCC =
      (confusionMatrix.TP * confusionMatrix.TN -
        confusionMatrix.FP * confusionMatrix.FN) /
      Math.sqrt(
        (confusionMatrix.TP + confusionMatrix.FP) *
          (confusionMatrix.TP + confusionMatrix.FN) *
          (confusionMatrix.TN + confusionMatrix.FP) *
          (confusionMatrix.TN + confusionMatrix.FN)
      );
    ans.push(confusionMatrix);
  });
  ans.sort((a, b) => b.MCC - a.MCC);
  return ans;
};

let processData = (data) => {
  let events = getEvents(data);
  let correlations = getCorrelations(data, events);
  fillEventTable(data);
  fillCorrelationTable(correlations);
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    processData(response);
  });
