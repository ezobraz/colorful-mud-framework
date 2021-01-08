const Color = require('../../common/color');
const Base = require('../base');

const day = 1000 * 60 * 60 * 24;

module.exports = class Item extends Base {
    get dictionary() {
        return {
            ...super.dictionary,
            name: {
                type: String,
                default: "Unknown",
            },
            slot: {
                type: String,
                default: null,
            },
            weight: {
                type: Number,
                default: 0.1,
                min: 0.1,
                max: 100,
            },
            quality: {
                type: Number,
                default: 10,
                min: 0,
                max: 100,
            },
        }
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

        return `[${this.className}] [b][${color}]${this.name}[/]`;
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
        let res = this.quality * 1.1 + this.condition * 3.2;
        return Math.round(res * 100) / 100;
    }
};
