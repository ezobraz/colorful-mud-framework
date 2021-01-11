const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/skills/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('skills', name, require(`../entities/skills/${name}`));
                    }
                });

                resolve(true);
            });
        });

        Debug.status('Skill types', Object.keys(Dictionary.get('skills')).length);
    }
};
