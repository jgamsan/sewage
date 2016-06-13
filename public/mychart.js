/**
 * Created by jose on 19/5/16.
 */
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//var moment = require('moment');
//var a = moment().format();
var sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('sewage');
var alturas = [];
var horas = [];

db.serialize(function() {
  db.each("SELECT hora, altura FROM lecturas", function(err, row) {
    alturas.push(row.altura);
    horas.push(row.hora);
  });
});

db.close();


var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};

var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};


var config = {
  type: 'line',
  data: {
      labels: horas,
      datasets: [{
          label: "My First dataset",
          data: alturas,
          fill: true,
          borderDash: [5, 5],
          borderColor: randomColor(0.4),
          backgroundColor: randomColor(0.5),
          pointBorderColor: randomColor(0.7),
          pointBackgroundColor: randomColor(0.5),
          pointBorderWidth: 1
      }]
  },
  options: {
      responsive: true,
      title:{
          display:true,
          text:'Chart.js Line Chart'
      },
      tooltips: {
          mode: 'label',
          callbacks: {
              // beforeTitle: function() {
              //     return '...beforeTitle';
              // },
              // afterTitle: function() {
              //     return '...afterTitle';
              // },
              // beforeBody: function() {
              //     return '...beforeBody';
              // },
              // afterBody: function() {
              //     return '...afterBody';
              // },
              // beforeFooter: function() {
              //     return '...beforeFooter';
              // },
              // footer: function() {
              //     return 'Footer';
              // },
              // afterFooter: function() {
              //     return '...afterFooter';
              // },
          }
      },
      hover: {
          mode: 'dataset'
      },
      scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  show: true,
                  labelString: 'Month'
              }
          }],
          yAxes: [{
              display: true,
              scaleLabel: {
                  show: true,
                  labelString: 'Value'
              },
              ticks: {
                  suggestedMin: 0,
                  suggestedMax: 60,
              }
          }]
      }
  }
};

var ctx = document.getElementById("mychart").getContext("2d");
var mychart = new Chart(ctx, config);
