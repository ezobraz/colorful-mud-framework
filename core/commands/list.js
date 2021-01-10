const Config = require('../config');
const admin = require('./admin');
const regular = require('./regular');

const moduleCommands = [];
const modules = Config.get('modules');
modules.forEach(dir => {
    const mod = require(`../../modules/${dir}`);
    if (mod.commands && mod.commands.length) {
        moduleCommands.push(...mod.commands);
    }
})

module.exports = [
    ...admin,
    ...regular,
    ...moduleCommands,
];
