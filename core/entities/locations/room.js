const Location = require('./base');

module.exports = class Room extends Location {
    get color() {
        return 'cw';
    }
};
