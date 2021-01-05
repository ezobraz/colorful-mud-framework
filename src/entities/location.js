const Model = require('../model');
const Entity = require('./index');
const Broadcaster = require('../engine/broadcaster');
const Store = require('../store');

module.exports = class Location extends Entity {
    get dictionary() {
        return {
            ...super.dictionary,
            _id: {
                type: String,
                default: null,
            },
            img: {
                type: Array,
                default: [],
            },
            name: {
                type: String,
                default: "Unknown",
            },
            desc: {
                type: String,
                default: null,
            },
            single: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'town',
                options: ['town', 'castle'],
            },
            ownerId: {
                type: String,
                default: null,
            },
            items: {
                type: Array,
                default: [],
            },
        }
    }

    async create() {
        if (this._id) {
            return;
        }

        const params = this.props;
        delete params._id;

        let res = await Model.mutations('locations/create', {
            ...params,
            code: this.name.toLowerCase(),
        });

        if (res) {
            this.props = res;
        }

        return res;
    }

    async exists() {
        if (!this.name) {
            return;
        }

        return await Model.getters('locations/findOne', {
            code: this.name.toLowerCase(),
        });
    }

    async save() {
        if (!this._id) {
            return;
        }

        await Model.mutations('locations/save', {
            ...this.props,
        });
    }

    async remove() {
        if (this.players.length) {
            return;
        }

        // call db

        Store.remove('locations', this);
    }

    get players() {
        return Store.findAll('players', 'locationId', this._id);
    }

    notifyAll({ text, exclude = null}) {
        this.players.forEach(ply => {
            if (ply !== exclude) {
                Broadcaster.system({
                    to: ply,
                    text,
                });
            }
        });
    }
};
