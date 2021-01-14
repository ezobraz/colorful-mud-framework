/**
* @namespace Dependent
*/
const Base = require('../base');

/**
* Base Dependent
*
* @memberof Dependent
*/
class Dependent extends Base {
    level(player) {
        return 0;
    }
};

module.exports = Dependent;
