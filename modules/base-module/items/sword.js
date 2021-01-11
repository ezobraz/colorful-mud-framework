const Item = require('../../../core/entities/items/base');

const day = 1000 * 60 * 60 * 24;

module.exports = class Sword extends Item {
    constructor(params = {}) {
        params.slot = params.slot || 'rHand';
        params.sharpenedOn = params.sharpenedOn || Date.now();

        super(params);
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
