const Config = require('../config');
const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        const modules = Config.get('modules');

        for (let dir of modules) {
            // tran
            let tranPath = `./modules/${dir}/tran.json`;
            if (fs.existsSync(tranPath)) {
                const tranData = require(`../.${tranPath}`);
                Dictionary.append('tran', tranData[tran.lang] || {});
            }

            // dictionary
            let promises = [
                'params',
                'attributes',
                'skills',
                'locations',
                'items',
                'actors',
            ].map(collection => new Promise((resolve, reject) => {
                fs.readdir(`./modules/${dir}/${collection}/`, (err, files) => {
                    if (!err && files) {
                        files.forEach(file => {
                            if (file != 'base.js') {
                                const name = file.replace('.js', '');
                                Dictionary.add(collection, name, require(`../../modules/${dir}/${collection}/${name}`));
                            }
                        });
                    }

                    resolve(true);
                });
            }));

            await Promise.all(promises);

            let mod;
            let indexFile = `./modules/${dir}/index.js`;
            if (fs.existsSync(indexFile)) {
                mod = require(`../../modules/${dir}`);

                // init
                if (typeof mod.init != 'undefined') {
                    await mod.init();
                }

                // commands
                if (mod.commands && mod.commands.length) {
                    Dictionary.get('commands').push(...mod.commands);
                }
            }

            Debug.status(`Module "${dir}"`, 'loaded');
        }

        Debug.status('Total modules loaded', modules.length);
    }
};
