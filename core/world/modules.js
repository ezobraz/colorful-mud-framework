const Config = require('../config');
const Debug = require('../engine/debug');

const initModules = async () => {
    const modules = Config.get('modules');

    modules.forEach(async dir => {
        const mod = require(`../../modules/${dir}`);
        await mod.init();
        Debug.status(`Module "${mod.name || 'unknown'}"`, 'loaded');
    });

    return modules.length;
};

module.exports = {
    async init() {
        const count = await initModules();
        Debug.status('Total modules loaded', count);
    }
};
