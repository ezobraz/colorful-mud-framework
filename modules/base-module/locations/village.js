const Location = __require('core/entities/locations/base');

/**
* Village
*
* @memberof Locations
* @extends Location
*/
class Village extends Location {
    get color() {
        return 'cy';
    }
};

module.exports = Village;
