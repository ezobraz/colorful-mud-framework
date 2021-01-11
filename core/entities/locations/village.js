const Location = require('./base');

module.exports = class Village extends Location {
    get color() {
        return 'cy';
    }
};
