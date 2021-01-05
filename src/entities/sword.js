const Color = require('../common/color');
const Item = require('./_item');

module.exports = class Sword extends Item {
    get dictionary() {
        return {
            ...super.dictionary,
            sharpness: {
                type: Number,
                default: 0.0,
            },
            length: {
                type: Number,
                default: 1.0,
            },
            slot: {
                type: String,
                default: 'rHand',
            },
        }
    }

    get attackSpeed() {
        return 0;
    }

    get power() {
        return 0;
    }
};
