const { readdirSync } = require('fs');
const Debug = require('../engine/debug');

const modules = readdirSync('modules', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

const initModules = async () => {
    let count = 0;
    modules.forEach(async dir => {
        const mod = require(`../../modules/${dir}`);

        if (mod.enabled) {
            count++;
            await mod.init();
            Debug.status(`Module "${mod.name || 'unknown'}"`, 'loaded');
        }
    });

    return count;
};

module.exports = {
    async init() {
        const count = await initModules();
        Debug.status('Total modules loaded', count);
    }
};
