const Model = require('../model');
const Broadcaster = require('../engine/broadcaster');
const Store = require('../store');

const savableParams = [
    '_id',
    'img',
    'name',
    'desc',
    'single',
    'type',
    'ownerId',
    'items',
];

module.exports = class Location {
    constructor({
        _id = null,
        img = [],
        name = null,
        desc = null,
        type = 'town',
        ownerId = null,
        single = false,
        items = [],
    }) {
        this._id = _id;
        this.img = img;
        this.name = name;
        this.desc = desc;
        this.type = type;
        this.ownerId = ownerId;
        this.single = single;
        this.items = items;
    }

    get savableParams() {
        let res = {}

        savableParams.forEach(item => {
            res[item] = this[item];
        });

        return res;
    }

    set savableParams(params) {
        savableParams.forEach(item => {
            this[item] = params[item];
        });
    }

    async create() {
        if (this._id) {
            return;
        }

        const params = this.savableParams;
        delete params._id;

        let res = await Model.mutations('locations/create', {
            ...params,
            code: this.name.toLowerCase(),
        });

        if (res) {
            this.savableParams = res;
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
            ...this.savableParams,
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
