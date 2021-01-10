const Model = require('../model');
const fs = require('fs')

const runtime = {};
const static = require('../../config/config.default.json');

if (fs.existsSync('./config/config.json')) {
    let res = require('../../config/config.json');
    for (let i in res) {
        static[i] = res[i];
    }
}

module.exports = {
    async getRuntime(name) {
        if (typeof runtime[name] != 'undefined') {
            return runtime[name];
        }

        let res = await Model.getters('config/findOne', { name });
        runtime[name] = res ? res.value : null;
        return runtime[name];
    },

    async setRuntime(name, value) {
        runtime[name] = value;
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

        let res = static;

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
