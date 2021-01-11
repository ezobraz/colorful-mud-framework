const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/items/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('items', name, require(`../entities/items/${name}`));
                    }
                });

                resolve(true);
            });
        });

        Debug.status('Item types', Object.keys(Dictionary.get('items')).length);
    }
};
