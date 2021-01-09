const Model = require('../model');

module.exports = {
    runtime: {},
    static: {
        format: {
            lineLength: 62,
        },
        debug: {
            logRam: true,
        },
        chat: {
            requireCommand: true,
        },
        players: {
            auth: {
                maxPasswordAttempts: 5,
            },
            afkTimeout: 600000, // ms
        },
        allPermissions: [
            'set permissions',

            'see location id',
            'create locations',
            'delete locations',
            'edit locations',

            'teleport locations',
            'teleport players',

            'create items',
            'delete items',

            'draw',

            'system',
        ],
    },

    async getRuntime(name) {
        if (typeof this.runtime[name] != 'undefined') {
            return this.runtime[name];
        }

        let res = await Model.getters('config/findOne', { name });
        this.runtime[name] = res ? res.value : null;
        return this.runtime[name];
    },

    async setRuntime(name, value) {
        this.runtime[name] = value;
        return await Model.mutations('config/save', {
            name,
            value,
        });
    },

    get(path) {
        let parts = path.split('.');

        if (!parts.length) {
            return;
        }

        let res = this.static;

        for (let key of parts) {
            if (!res[key]) {
                return res;
                break;
            }

            res = res[key];
        }

        return res;
    },
};
