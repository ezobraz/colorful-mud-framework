const Location = require('../../../core/entities/locations/base');

module.exports = class Castle extends Location {
    get color() {
        return 'cw';
    }
};
