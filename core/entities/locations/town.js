const Location = require('./base');

module.exports = class Town extends Location {
    get color() {
        return 'cY';
    }
};
