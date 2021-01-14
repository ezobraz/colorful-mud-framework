const Config = __require('core/config');
const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');
const fs = require('fs');

module.exports = {
    async init() {
        const modules = Config.get('modules');

        for (let dir of modules) {
            let indexFile = `./modules/${dir}/index.js`;

            // tran
            if (fs.existsSync(`./modules/${dir}/tran.json`)) {
                const modTran = __require(`modules/${dir}/tran.json`);
                Dictionary.append('tran', modTran[tran.lang] || {});
            }

            if (fs.existsSync(indexFile)) {
                const mod = __require(`modules/${dir}`);

                // classes
                [
                    'params',
                    'attributes',
                    'skills',
                    'dependents',
                    'locations',
                    'items',
                    'actors',
                ].forEach(collection => {
                    if (mod[collection]) {
                        for (let key in mod[collection]) {
                            Dictionary.add(collection, key.toLowerCase(), mod[collection][key]);
                        }
                    }
                });

                // commands
                if (mod.commands && mod.commands.length) {
                    Dictionary.get('commands').push(...mod.commands);
                }

                // events
                if (mod.events) {
                    Dictionary.append('events', mod.events);
                }

                // cron
                if (mod.cron && mod.cron.length) {
                    Dictionary.get('cron').push(...mod.cron);
                }

                // init
                if (typeof mod.init != 'undefined') {
                    await mod.init();
                }
            }

            Debug.status(`Module "${dir}"`, 'loaded');
        }
    }
};
