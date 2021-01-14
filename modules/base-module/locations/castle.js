const Location = __require('core/entities/locations/base');

/**
* Castle
*
* @memberof Locations
* @extends Location
*/
class Castle extends Location {
    get color() {
        return 'cw';
    }
};

module.exports = Castle;
