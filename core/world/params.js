const Debug = require('../engine/debug');
const Store = require('../store');
const fs = require('fs');

const initParams = async () => {
    return await new Promise((resolve, reject) => {
        fs.readdir('./core/entities/params/', (err, files) => {
            files.forEach(file => {
                if (file != 'base.js') {
                    const name = file.replace('.js', '');
                    const paramClass = require(`../entities/params/${name}`);
                    Store.add('params', paramClass, name);
                }
            });

            resolve(true);
        });
    });
};

module.exports = {
    async init() {
        await initParams();
        Debug.status('Params loaded', Object.keys(Store.get('params')).length);
    }
};
