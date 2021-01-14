/**
* @namespace Attributes
*/

const Base = require('../base');

/**
* Base Attribute
*
* @memberof Attributes
*/
class Attribute extends Base {
    constructor(params = {}) {
        super(params);

        this.level = parseInt(params.level) || 0;
        this.progress = parseFloat(params.progress) || 0;
        this.max = parseInt(params.max) || 100;
    }

    get cap() {
        return this.level * 100;
    }

    addPoints(points) {
        if (!points) {
            return;
        }

        if (this.progress + points > this.cap && this.level < this.max) {
            this.progress = this.progress + points - this.cap;
            this.level++;
        }
    }
};

module.exports = Attribute;
