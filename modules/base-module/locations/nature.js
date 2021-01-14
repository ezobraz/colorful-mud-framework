const Location = __require('core/entities/locations/base');

/**
* Nature
*
* @memberof Locations
* @extends Location
*/
class Nature extends Location {
    get color() {
        return 'cg';
    }
};

module.exports = Nature;
