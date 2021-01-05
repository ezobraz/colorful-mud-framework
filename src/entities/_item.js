const Color = require('../common/color');
const Entity = require('./index');

module.exports = class Item extends Entity {
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
            },
            quality: {
                type: Number,
                default: 100,
            },
        }
    }

    get condition() {
        let now = new Date();
        let createdOn = this.createdOn;

        // calculate condition based on creation time. bad - 0, good - 100
        return 0;
    }

    get value() {
        let createdOn = this.createdOn;

        // todo: calculate value based on creation time, quality, condition
        return 0;
    }
};
