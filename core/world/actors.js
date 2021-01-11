const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/actors/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('actors', name, require(`../entities/actors/${name}`));
                    }
                });

                resolve(true);
            });
        });

        Debug.status('Actor types', Object.keys(Dictionary.get('actors')).length);
    }
};
