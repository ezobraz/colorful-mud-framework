/**
* @namespace Params
*/

const Base = require('../base');

/**
* Base Param
*
* @memberof Params
*/
class Param extends Base {
    constructor(params = {}) {
        super(params);

        this.level = parseInt(params.level) || 0;
    }

    max(player) {
        return 100;
    }

    get bgColor() {
        return 'bw';
    }

    get textColor() {
        return 'cS';
    }

    get shortName() {
        return this.name.slice(0, 2).toUpperCase();
    }
};

module.exports = Param;
