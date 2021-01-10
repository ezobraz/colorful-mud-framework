const Color = require('../../common/color');
const Base = require('../base');
const Config = require('../../config');
const Store = require('../../store');

module.exports = class Actor extends Base {
    constructor(params = {}) {
        super(params);
        this.meta = {};
    }

    get dictionary() {
        return {
            ...super.dictionary,
            _id: {
                type: String,
                default: null,
            },
            name: {
                type: String,
                default: "Unknown",
            },
            gender: {
                type: String,
                default: 'm',
                options: ['m', 'f'],
            },
            locationId: {
                type: String,
                default: null,
            },
            inventory: {
                type: Array,
                default: [],
            },
            skills: {
                type: Array,
                default: [],
            },
            params: {
                type: Array,
                default: [],
            },
            attributes: {
                type: Array,
                default: [],
            },

            slots: {
                type: Object,
                default: {
                    rHand: null,
                    lHand: null,
                    rShoulder: null,
                    lShoulder: null,
                    chest: null,
                    legs: null,
                    boots: null,
                    robe: null,
                },
            },
        }
    }

    get isGm() {
        if (this.permissions && this.permissions.length > 0) {
            const allPermissions = require('../../commands/helpers/all-permissions')();

            if (this.permissions.length < allPermissions) {
                return 1;
            }

            return 2;
        }

        return 0;
    }

    get color() {
        if (this.permissions && this.permissions.length > 0) {
            const allPermissions = require('../../commands/helpers/all-permissions')();

            if (this.permissions.length < allPermissions) {
                return 'cY';
            }

            return 'cR';
        }

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

    initInventory() {
        this.inventory = this.inventory.map(data => {
            const obj = require(`../items/${data.className.toLowerCase()}`);
            return new obj(data);
        });
    }

    initAttributes() {
        this.attributes = this.attributes.map(data => {
            const obj = Store.find('attributes', data.name.toLowerCase());
            return new obj(data);
        });
    }

    initSkills() {
        this.skills = this.skills.map(data => {
            const obj = Store.find('skills', data.name.toLowerCase());
            return new obj(data);
        });
    }

    initParams() {
        this.params = this.params.map(data => {
            const obj = Store.find('params', data.name.toLowerCase());
            return new obj(data);
        });
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
        const exists = this[collection].find(a => a.name == param.name);

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
