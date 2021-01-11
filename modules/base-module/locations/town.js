const Location = require('../../../core/entities/locations/base');

module.exports = class Town extends Location {
    get color() {
        return 'cY';
    }
};
