const Processor = require('../../processor');
const Color = require('../../common/color');
const Base = require('../base');
const Config = require('../../config');

module.exports = class Actor extends Base {
    constructor(params = {}) {
        super(params);

        this.meta = {
            state: {},
        };
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

            hp: {
                type: Number,
                default: 10,
            },
            ed: {
                type: Number,
                default: 10,
            },
            mp: {
                type: Number,
                default: 0,
            },

            skills: {
                type: Object,
                default: {
                    fencing: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    shooting: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                },
            },

            attributes: {
                type: Object,
                default: {
                    strength: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    dexterity: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    willpower: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    wisdom: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    charisma: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },
                    intelligence: {
                        level: 1,
                        progress: 0,
                        max: 100,
                    },

                    magic: {
                        level: 0,
                        progress: 0,
                        max: 100,
                    },
                },
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

        const attrKeys = Object.keys(this.attributes);
        const skillKeys = Object.keys(this.skills)

        let sum = attrKeys.reduce((a, b) => a + this.attributes[b].level, 0) +
                  skillKeys.reduce((a, b) => a + this.skills[b].level, 0);

        let max = attrKeys.reduce((a, b) => a + this.attributes[b].max, 0) +
                  skillKeys.reduce((a, b) => a + this.skills[b].max, 0);

        let perc = sum * 100 / max;

        if (perc >= 80) {
            return 'cg';
        }

        if (perc >= 40) {
            return 'cc';
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

    get mpMax() {
        if (this.attributes.magic.level <= 0) {
            return 0;
        }

        let max = Math.floor(1 + (this.attributes.magic.level * 0.4));

        return this.mp > max ? this.mp : max;
    }

    get speed() {
        return 15 +
            Math.floor(this.attributes.strength.level * 0.2) +
            Math.floor(this.attributes.willpower.level * 0.1) +
            Math.floor(this.attributes.dexterity.level * 0.3);
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

    initInventory() {
        this.inventory = this.inventory.map(data => {
            const obj = require(`../items/${data.className.toLowerCase()}`);
            return new obj(data);
        });
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
