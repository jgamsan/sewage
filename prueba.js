var moment = require('moment');
hoy = moment().format();
a = moment().startOf('day').add(12, 'hours').subtract(1, 'days').format();
b = moment(a).add(12, 'hours').subtract(1, 'days').format();
console.log(a);
