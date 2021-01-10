const Location = require('./index');

module.exports = class Village extends Location {
    get color() {
        return 'cy';
    }
};
