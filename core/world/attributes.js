const Debug = require('../engine/debug');
const Store = require('../store');
const fs = require('fs');

const initAttributes = async () => {
    return await new Promise((resolve, reject) => {
        fs.readdir('./core/entities/attributes/', (err, files) => {
            files.forEach(file => {
                if (file != 'base.js') {
                    const name = file.replace('.js', '');
                    const attrClass = require(`../entities/attributes/${name}`);
                    Store.add('attributes', attrClass, name);
                }
            });

            resolve(true);
        });
    });
};

module.exports = {
    async init() {
        await initAttributes();
        Debug.status('Attributes loaded', Object.keys(Store.get('attributes')).length);
    }
};
