const Color = require('../common/color');
const Item = require('./_item');

const defaultAttributes = {
    sharpness: 0.0,
    length: 1.0,
};

module.exports = class Sword extends Item {
    constructor(params = {}) {
        params.slot = 'rHand';

        super(params);
        this.attributes = params;
    }

    get attributes() {
        let res = super.attributes;

        for (let i in defaultAttributes) {
            res[i] = this[i];
        }

        return res;
    }

    set attributes(params) {
        super.attributes = params;

        for (let i in defaultAttributes) {
            this[i] = params[i] || defaultAttributes[i];
        }
    }

    get attackSpeed() {
        return 0;
    }

    get power() {
        return 0;
    }
};
