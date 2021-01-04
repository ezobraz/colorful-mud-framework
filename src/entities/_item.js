const Color = require('../common/color');

const defaultAttributes = {
    name: null,
    slot: null,
    weight: 0.1,
    quality: 100,
    wear: 0,
    value: 0,
};

module.exports = class Item {
    constructor(params) {
        this.attributes = params;
    }

    get attributes() {
        const res = {};

        for (let i in defaultAttributes) {
            res[i] = this[i];
        }

        return res;
    }

    set attributes(params) {
        for (let i in defaultAttributes) {
            this[i] = params[i] || defaultAttributes[i];
        }
    }
};
