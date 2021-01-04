const Color = require('../common/color');
const Item = require('./_item');

module.exports = class Sword extends Item {
    constructor(params) {
        super(params);

        this.sharpness = params.sharpness || 0.0;
        this.length = params.length || 1.0;
    }

    get attackSpeed() {
        return 0;
    }

    get power() {
        return 0;
    }
};
