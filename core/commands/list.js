const { readdirSync } = require('fs');
const admin = require('./admin');
const regular = require('./regular');

const modules = readdirSync('modules', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
const moduleCommands = [];
modules.forEach(dir => {
    const mod = require(`../../modules/${dir}`);
    if (mod.enabled && mod.commands && mod.commands.length) {
        moduleCommands.push(...mod.commands);
    }
});

module.exports = [
    ...admin,
    ...regular,
    ...moduleCommands,
];
