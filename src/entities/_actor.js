const Processor = require('../processor');
const Color = require('../common/color');

module.exports = class Actor {
    constructor({
        _id = null,

        name = null,
        gender = 'm',

        locationId = null,

        hp = 10,
        ed = 10,

        strength = 1,
        willpower = 1,
        dexterity = 1,

        fencing = 0,
        bows = 0,

        inventory = [],
    }) {
        this._id = _id;

        this.name = name;

        this.locationId = locationId;
        this.inventory = inventory;
        this.gender = gender;

        this.hp = hp;
        this.ed = ed;

        this.attributes = {
            strength: {
                level: strength,
                progress: 0,
            },
            willpower: {
                level: willpower,
                progress: 0,
            },
            dexterity: {
                level: dexterity,
                progress: 0,
            },
        };

        this.skills = {
            fencing: {
                level: fencing,
                progress: 0,
            },
            bows: {
                level: bows,
                progress: 0,
            },
        };

        this.slots = {
            rHand: null,
            lHand: null,
            rShoulder: null,
            lShoulder: null,
            chest: null,
            legs: null,
            boots: null,
            robe: null,
        };

        this.meta = {
            state: {
                name: null,
                step: null,
            },
        };
    }

    get hpMax() {
        let max = 10 + Math.floor(this.attributes.strength.level * 0.5);

        return this.hp > max ? this.hp : max;
    }

    get edMax() {
        let max = 10 +
            Math.floor(this.attributes.strength.level * 0.2) +
            Math.floor(this.attributes.willpower.level * 0.2) +
            Math.floor(this.attributes.dexterity.level * 0.3);

        return this.ed > max ? this.ed : max;
    }

    get state() {
        return this.meta.state;
    }

    set state({ name, step = null }) {
        if (typeof name != 'undefined') {
            if (name && typeof Processor[name] == 'undefined') {
                return;
            }

            this.meta.state.name = name;
        }

        if (step !== null) {
            this.meta.state.step = step;
        }
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
