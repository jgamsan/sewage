/**
 * Created by jose on 19/5/16.
 */
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var moment = require('moment');
var a = moment().format();
var db = new Nedb({ filename: '../db.json', autoload: true });

db.find({ "hora": { $lt: a } }, {"altura": 1, "hora": 1, "_id": 0}, function (err, docs) {
    docs.forEach(function(value) {
        arr.push(value.altura)
    });
    console.log(sess.data);
});

var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};

var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};

var config = {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            data: [7,9,2,5,6,4,8],
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
                    suggestedMin: -1,
                    suggestedMax: 15,
                }
            }]
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};

