const Color = require('../../common/color');
const Base = require('../base');
const Config = require('../../config');
const Store = require('../../store');
const Dictionary = require('../../dictionary');

const defaultParams = {
    _id: null,
    name: 'Unknown',
    gender: 'm',
    locationId: null,
    inventory: [],
    params: [],
    attributes: [],
    skills: [],
    slots: {
        rHand: null,
        lHand: null,
        rShoulder: null,
        lShoulder: null,
        chest: null,
        legs: null,
        boots: null,
        robe: null,
    },
};

module.exports = class Actor extends Base {
    constructor(params = {}) {
        super({...defaultParams, ...params});
    }

    init() {
        ['inventory', 'attributes', 'skills', 'params'].forEach(collection => {
            this[collection] = this[collection].map(data => {
                const dic = collection === 'inventory' ? 'items' : collection;
                const obj = Dictionary.get(dic, data.type.toLowerCase());
                return new obj(data);
            });
        });
    }

    get isGm() {
        return 0;
    }

    get color() {
        return 'cW';
    }

    get displayName() {
        const isGm = this.isGm;
        const color = this.color;

        if (isGm == 2) {
            return `[cR][A][/] [${color}]${this.name}[/]`;
        } else if (isGm == 1) {
            return `[cY][GM][/] [${color}]${this.name}[/]`;
        }

        return `[${color}]${this.name}[/]`;
    }

    changeLocation(location, silent = false) {
        const to = typeof location == 'string' ? Store.findById('locations', location) : location;

        if (!to) {
            return;
        }

        let from = Store.findById('locations', this.locationId);

        this.locationId = to._id;

        if (from && !silent) {
            from.notifyAll({
                text: Color.parse(`${this.name} left`),
                exclude: this,
            });
        }

        if (!silent) {
            to.notifyAll({
                text: Color.parse(`${this.name} appeared here`),
                exclude: this,
            });
        }

        if (from) {
            Debug.log(Color.parse(`${this.displayName} went from [b]${from.displayName}[/] to [b]${to.displayName}[/]`), 'MOVE');
        } else {
            Debug.log(Color.parse(`${this.displayName} appeared in [b]${to.displayName}[/]`), 'MOVE');
        }
    }

    setParam(collection = 'params', param) {
        const exists = this[collection].find(a => a.type == param.type);

        if (exists) {
            exists.level = param.level;
            return;
        }

        this[collection].push(param);
    }

    addItem(item) {
        this.inventory.push(item);
    }

    removeItem(item) {
        this.inventory = this.inventory.filter(i => i !== item);
    }

    equip(item) {
        let slot = item.slot;
        if (!slot) {
            return;
        }

        this.removeItem(item);
        this.slots[slot] = item;
    }

    unequip(item) {
        let slot = item.slot;

        if (!slot) {
            return;
        }

        if (!this.slots[slot]) {
            return;
        }

        this.slots[slot] = null;
        this.addItem(item);
    }
};
