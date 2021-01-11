const Color = require('../../common/color');
const Base = require('../base');

const day = 1000 * 60 * 60 * 24;

const defaultParams = {
    name: 'Unknown',
    slot: null,
    weight: 0.1,
    quality: 0,
};

module.exports = class Item extends Base {
    constructor(params = {}) {
        if (typeof params.quality != 'undefined') {
            params.quality = parseFloat(params.quality);
        }

        super({...defaultParams, ...params});
    }

    get displayName() {
        const condition = this.condition;
        let color = 'cW';

        if (condition >= 25) {
            color = 'cC';
        }

        if (condition >= 50) {
            color = 'cG';
        }

        if (condition >= 75) {
            color = 'cB';
        }

        if (condition >= 90) {
            color = 'cY';
        }

        if (condition >= 95) {
            color = 'cM';
        }

        return `[${tran.slate(`item-type-${this.type.toLowerCase()}`)}] [b][${color}]${this.name}[/]`;
    }

    get condition() {
        const negative = (Date.now() - this.createdOn) / (day * 5);
        let res = this.quality + (this.weight / 2.5) - negative;

        if (res < 0) {
            res = 0;
        }

        if (res > 100) {
            res = 100;
        }

        return Math.round(res * 100) / 100;
    }

    get value() {
        let res = this.quality * 0.4 + this.condition * 0.7;
        return Math.round(res * 100) / 100;
    }
};
