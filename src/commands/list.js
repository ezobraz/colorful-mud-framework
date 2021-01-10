const admin = require('./admin');
const regular = require('./regular');
const Store = require('../store');

module.exports = () => {
    const modules = Store.get('modules');
    const moduleCommands = [];

    modules.forEach(mod => {
        if (mod.commands && mod.commands.length) {
            moduleCommands.push(...mod.commands);
        }
    });

    return [
        ...admin,
        ...regular,
        ...moduleCommands,
    ];
};
