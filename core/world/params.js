const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/params/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('params', name, require(`../entities/params/${name}`));
                    }
                });

                resolve(true);
            });
        });

        Debug.status('Param types', Object.keys(Dictionary.get('params')).length);
    }
};
