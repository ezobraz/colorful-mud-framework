const Color = require('../common/color');

module.exports = class Item {
    constructor({
        _id = null,
        name = null,
        slot = null,
        weight = 0.1,
        quality = 100,
        wear = 0,
        value = 0,
    }) {
        this._id = _id;
        this.name = name;
        this.slot = slot;
        this.weight = weight;
        this.quality = quality;
        this.wear = wear;
        this.value = value;
    }
};
