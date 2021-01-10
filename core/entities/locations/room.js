const Location = require('./index');

module.exports = class Room extends Location {
    get color() {
        return 'cw';
    }
};
