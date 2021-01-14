const { Debug } = __require('core/tools');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/dependents/', (err, files) => {
                if (!err && files) {
                    files.forEach(file => {
                        if (file != 'base.js') {
                            const name = file.replace('.js', '');
                            Dictionary.add('dependents', name, require(`../entities/dependents/${name}`));
                        }
                    });
                }

                resolve(true);
            });
        });

        Debug.status(`${Object.keys(Dictionary.get('dependents')).length} Dependent Classes`, 'loaded');
    }
};
