const { readdirSync } = require('fs');
const Debug = require('../engine/debug');
const Store = require('../store');

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const initModules = async () => {
    let res = getDirectories('modules');

    res.forEach(dir => {
        const mod = require(`../../modules/${dir}`);

        if (mod.enabled) {
            Store.add('modules', mod);
        }
    });

    const modules = Store.get('modules');
    modules.forEach(async mod => {
        await mod.init();
        Debug.status(`Module "${mod.name || 'unknown'}"`, 'loaded');
    });

    return modules.length;
};

module.exports = {
    async init() {
        const count = await initModules();
        Debug.status('All modules loaded', count);
    }
};
