/**
 * @namespace Items
 */

const { Color } = __require('core/tools');
const Config = __require('core/config');
const Base = require('../base');

const day = 1000 * 60 * 60 * 24;

const rareColor = rare => {
    switch(rare) {
        case 6: // legendary
            return '[b][cY]';
        case 5: // epic
            return '[b][cM]';
        case 4: // rare
            return '[b][cC]';
        case 3: // uncommon
            return '[b][cG]';
        case 2: // common
            return '[b][cW]';
        case 1: // poor
        default:
            return '';
    }
}

/**
* Parent-class for all "actors" in game
*
* @memberof Items
*/
class Item extends Base {
    constructor(params = {}) {
        super(params);

        this.name = params.name || 'Unknown';
        this.slot = params.slot || null;
        this.rare = parseInt(params.rare) || 1;
        this.weight = parseFloat(params.weight) || 0.1;
        this.quality = parseFloat(params.quality) || 0.1;
    }

    get setters() {
        const res = Object.keys(this);
        const exclude = ['meta', 'tmp', 'class'];
        return res.filter(p => !exclude.includes(p));
    }

    get condition() {
        const quality = parseFloat(this.quality);
        const weight = parseFloat(this.weight);

        const negative = (Date.now() - this.createdOn) / (day * 5);
        let res = quality + (weight / 2.5) - negative;

        if (res < 0) {
            res = 0;
        }

        if (res > 100) {
            res = 100;
        }

        return Math.round(res * 100) / 100;
    }

    get value() {
        const quality = parseFloat(this.quality);
        const condition = parseFloat(this.condition);
        const rare = parseInt(this.rare);

        let res = (quality * 0.4 + condition * 0.7) * rare;
        return Math.round(res * 100) / 100;
    }

    get displayClass() {
        return tran.slate(`item-type-${this.class.toLowerCase()}`);
    }

    get displayName() {
        const rare = parseInt(this.rare);
        let color = rareColor(rare);

        return `[${this.displayClass}] ${color}${this.name}[/]`;
    }

    get displayWeight() {
        const weight = parseFloat(this.weight);
        let color = 'cg';

        if (weight >= 50) {
            color = 'cr';
        } else if (weight >= 25) {
            color = 'cy';
        } else if (weight >= 10) {
            color = 'cb';
        }

        return `[${color}]${weight}[/]`;
    }

    get displayQuality() {
        const quality = parseFloat(this.quality);
        let color = 'cr';

        if (quality >= 90) {
            color = 'cg';
        } else if (quality >= 75) {
            color = 'cc';
        } else if (quality >= 50) {
            color = 'cb';
        } else if (quality >= 25) {
            color = 'cy';
        }

        return `[${color}]${quality}%[/]`;
    }

    get displayCondition() {
        const condition = parseFloat(this.condition);
        let color = 'cr';

        if (condition >= 90) {
            color = 'cg';
        } else if (condition >= 75) {
            color = 'cc';
        } else if (condition >= 50) {
            color = 'cb';
        } else if (condition >= 25) {
            color = 'cy';
        }

        return `[${color}]${condition}%[/]`;
    }

    get displayValue() {
        return Color.price(this.value);
    }

    get displayRare() {
        const rare = parseInt(this.rare);
        let color = rareColor(rare);

        return `${color}${tran.slate(`item-type-rare-${rare}`)}[/]`;
    }
};

module.exports = Item;
