/**
 * Created by jose on 5/4/16.
 */
var moment = require('moment');
var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/db.json', autoload: true });
var a = moment().format();


/*db.find({ "hora": { $lt: a } }, {"altura": 1, "hora": 1, "_id": 0}, function (err, docs) {
    var arr = [];
    docs.forEach(function(value) {
        arr.push(value.altura)
    });
});*/

var data = db.find({ "hora": { $lt: a } }, {"altura": 1, "hora": 1, "_id": 0});

console.log(data);