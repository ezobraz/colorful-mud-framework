const Color = require('../../common/color');
const Item = require('./index');

const day = 1000 * 60 * 60 * 24;

module.exports = class Sword extends Item {
    get dictionary() {
        return {
            ...super.dictionary,
            length: {
                type: Number,
                default: 1.0,
            },
            slot: {
                type: String,
                default: 'rHand',
            },
            sharpenedOn: {
                type: Date,
                default: null,
            },
            weight: {
                type: Number,
                default: 1.5,
                min: 0.4,
                max: 10,
            },
        }
    }

    get outputData() {
        return [
            {
                name: 'Sharpness',
                value: `${this.sharpness}%`,
            },
        ];
    }

    get sharpness() {
        const negative = (Date.now() - this.sharpenedOn) / (day * 6);
        let res = 100 - negative - (100 - this.condition);

        if (res < 0) {
            res = 0;
        }

        if (res > 100) {
            res = 100;
        }

        return Math.round(res);
    }
};
