const Location = require('./base');

module.exports = class Dungeon extends Location {
    get color() {
        return 'cr';
    }
};
