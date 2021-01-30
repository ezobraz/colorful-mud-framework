/**
 * @namespace Actors
 */

const Base = require('../base');
const Config = __require('core/config');
const Store = __require('core/store');
const Dictionary = __require('core/dictionary');
const { Color } = __require('core/tools');

/**
* Parent-class for all "actors" in game
*
* @memberof Actors
*/
class Actor extends Base {
    constructor(params = {}) {
        super(params);

        this._id = params._id || null;
        this.name = params.name || 'Unknown';
        this.gender = params.gender || 'm';
        this.locationId = params.locationId || null;
        this.inventory = params.inventory || [];
        this.params = params.params || [];
        this.attributes = params.attributes || [];
        this.dependents = params.dependents || [];
        this.skills = params.skills || [];
        this.money = parseFloat(params.money) || 0.0;
        this.slots = params.slots || {
            rHand: null,
            lHand: null,
            rShoulder: null,
            lShoulder: null,
            chest: null,
            legs: null,
            boots: null,
            robe: null,
        };
    }

    /**
     * Grabs inventory, attributes, dependents, skills, params data and turns them into objects
     *
     */
    init() {
        ['inventory', 'attributes', 'dependents', 'skills', 'params'].forEach(collection => {
            this[collection] = this[collection].map(data => {
                const dic = collection === 'inventory' ? 'items' : collection;
                const obj = Dictionary.get(dic, data.class.toLowerCase());
                return new obj(data);
            });
        });
    }

    /**
     * Outputs the GM level
     *
     * @type {Number}
     */
    get isGm() {
        return 0;
    }

    /**
     * Outputs color
     *
     * @type {String}
     */
    get color() {
        return 'cW';
    }

    /**
     * Colored name of the Actor
     *
     * @type {String}
     */
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

    /**
     * Add item to inventory
     *
     * @param {Object} item Item object
     */
    addItem(item) {
        this.inventory.push(item);
    }

    /**
     * Remove item from inventory
     *
     * @param {Object} item Item object
     */
    removeItem(item) {
        this.inventory = this.inventory.filter(i => i !== item);
    }

    /**
     * Equip item
     *
     * @param {Object} item Item object
     */
    equip(item) {
        let slot = item.slot;
        if (!slot) {
            return;
        }

        this.removeItem(item);
        this.slots[slot] = item;
    }

    /**
     * Unequip item
     *
     * @param {Object} item Item object
     */
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

module.exports = Actor;
