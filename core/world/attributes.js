const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/attributes/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('attributes', name, require(`../entities/attributes/${name}`));
                    }
                });

                resolve(true);
            });
        });

        Debug.status(`${Object.keys(Dictionary.get('attributes')).length} Attribute Classes`, 'loaded');
    }
};
