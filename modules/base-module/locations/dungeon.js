const Location = __require('core/entities/locations/base');

/**
* Dungeon
*
* @memberof Locations
* @extends Location
*/
class Dungeon extends Location {
    get color() {
        return 'cr';
    }
};

module.exports = Dungeon;
