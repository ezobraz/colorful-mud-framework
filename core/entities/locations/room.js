const Location = require('./base');

/**
* Room
*
* @memberof Locations
*/
class Room extends Location {
    get color() {
        return 'cw';
    }
};

module.exports = Room;
