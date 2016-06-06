var moment = require('moment');
hoy = moment().format();
console.log(moment(hoy).startOf('day').format());