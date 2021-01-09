const Location = require('./index');

module.exports = class Dungeon extends Location {
    get color() {
        return 'cr';
    }
};
