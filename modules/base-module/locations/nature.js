const Location = require('../../../core/entities/locations/base');

module.exports = class Nature extends Location {
    get color() {
        return 'cg';
    }
};
