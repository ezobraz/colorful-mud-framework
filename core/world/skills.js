const Debug = require('../engine/debug');
const Store = require('../store');
const fs = require('fs');

const initSkills = async () => {
    return await new Promise((resolve, reject) => {
        fs.readdir('./core/entities/skills/', (err, files) => {
            files.forEach(file => {
                if (file != 'base.js') {
                    const name = file.replace('.js', '');
                    const skillClass = require(`../entities/skills/${name}`);
                    Store.add('skills', skillClass, name);
                }
            });

            resolve(true);
        });
    });
};

module.exports = {
    async init() {
        await initSkills();
        Debug.status('Skills loaded', Object.keys(Store.get('skills')).length);
    }
};
