const Item = __require('core/entities/items/base');

const day = 1000 * 60 * 60 * 24;

/**
* Sword Item
*
* @memberof Items
* @extends Item
*/
class Sword extends Item {
    constructor(params = {}) {
        params.slot = params.slot || 'rHand';
        super(params);

        this.sharpenedOn = params.sharpenedOn || Date.now();
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

module.exports = Sword;
