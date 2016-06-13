var moment = require('moment');
var altura_maxima = 247;
var linea_minima = 202;
var linea_maxima = 212;
hoy = moment().format();
a = moment().startOf('day').format();
b = moment(a).add(12, 'hours').format();
var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/db.json', autoload: true });

db.find({$and: [{"hora": { $lte: b } }, {"hora": {$gte: a}}]}, {"altura": 1, "hora": 1, "_id": 0}).sort({ hora: 1 }).exec(function (err, docs) {
  var arr = [];
  docs.forEach(function(value) {
      arr.push([moment(value.hora).format("HH:mm:ss"), altura_maxima - value.altura, linea_minima, linea_maxima])
  });
  console.log(docs);
});
