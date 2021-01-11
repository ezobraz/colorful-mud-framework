const Location = require('../../../core/entities/locations/base');

module.exports = class Dungeon extends Location {
    get color() {
        return 'cr';
    }
};
