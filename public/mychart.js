/**
 * Created by jose on 19/5/16.
 */
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//var moment = require('moment');
//var a = moment().format();

var db = new Nedb({ filename:  __dirname + '/db.json', autoload: true });

var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};

var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};

db.find({"altura": 1, "hora": 1, "_id": 0}, function (err, docs) {
  var arr = [];
  docs.forEach(function(value) {
    arr.push(value.altura)
  });
  console.log(docs);
  var config = {
    type: 'line',
    data: {
        labels: [34,36,43,38,45,42,38,38,47,40,41,48,44,47,48,48,37,44,46,47,37,39,35,35,36,34,41,33,41,37,39,49,49,33,39,40,43,33,43,32,47,36,38,49,47,37,38,37,44,48,41,44,43,41,37,41,33,41],
        datasets: [{
            label: "My First dataset",
            data: [34,36,43,38,45,42,38,38,47,40,41,48,44,47,48,48,37,44,46,47,37,39,35,35,36,34,41,33,41,37,39,49,49,33,39,40,43,33,43,32,47,36,38,49,47,37,38,37,44,48,41,44,43,41,37,41,33,41],
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
  var img = new Image();
  img.src = ctx.toDataURL('image/png');
  ctx.drawImage(img,200,150);
  //var mychart = new Chart(ctx, config);

});
