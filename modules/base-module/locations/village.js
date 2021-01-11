const Location = require('../../../core/entities/locations/base');

module.exports = class Village extends Location {
    get color() {
        return 'cy';
    }
};
