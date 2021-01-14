const Location = __require('core/entities/locations/base');

/**
* Town
*
* @memberof Locations
* @extends Location
*/
class Town extends Location {
    get color() {
        return 'cY';
    }
};

module.exports = Town;
