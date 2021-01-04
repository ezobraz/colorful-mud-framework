const admin = require('./admin');
const regular = require('./regular');

module.exports = [
    ...require('./admin'),
    ...require('./regular'),
];
