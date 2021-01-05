const Processor = require('../processor');
const Color = require('../common/color');
const Entity = require('./index');

module.exports = class Actor extends Entity {
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
                        level: 0,
                        progress: 0,
                    },
                    bows: {
                        level: 0,
                        progress: 0,
                    },
                },
            },
            attributes: {
                type: Object,
                default: {
                    strength: {
                        level: 0,
                        progress: 0,
                    },
                    willpower: {
                        level: 0,
                        progress: 0,
                    },
                    dexterity: {
                        level: 0,
                        progress: 0,
                    },
                },
            },
            inventory: {
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
