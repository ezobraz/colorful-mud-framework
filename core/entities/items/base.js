/**
 * @namespace Items
 */

const { Color } = __require('core/tools');
const Config = __require('core/config');
const { itemCondition, itemValue, itemRareColor } = __require('core/formulas');
const Base = require('../base');

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
        return itemCondition(this);
    }

    get value() {
        return itemValue(this);
    }

    get displayClass() {
        return tran.slate(`item-type-${this.class.toLowerCase()}`);
    }

    get displayName() {
        const rare = parseInt(this.rare);
        const color = itemRareColor(rare);

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
        let color = itemRareColor(rare);

        return `${color}${tran.slate(`item-type-rare-${rare}`)}[/]`;
    }
};

module.exports = Item;
