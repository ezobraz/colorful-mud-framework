const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');
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

        Debug.status(`${Object.keys(Dictionary.get('skills')).length} Skill Classes`, 'loaded');
    }
};
