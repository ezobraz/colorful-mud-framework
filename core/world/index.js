const { Debug, Color } = __require('core/tools');
const Modules = require('./modules');
const Params = require('./params');
const Attributes = require('./attributes');
const Skills = require('./skills');
const Dependents = require('./dependents');
const Items = require('./items');
const Actors = require('./actors');
const Locations = require('./locations');
const Commands = require('./commands');
const Events = require('./events');
const Server = require('./server');
const Cron = require('./cron');
const Event = require('../event');
const package = __require('package.json');

const logo = [
    Color.parse("[cR]   _____      _             __       _  [/]"),
    Color.parse("[cR]  / ____|    | |           / _|     | | [/]"),
    Color.parse("[cY] | |     ___ | | ___  _ __| |_ _   _| | [/]"),
    Color.parse("[cY] | |    / _ \\| |/ _ \\| '__|  _| | | | | [/]"),
    Color.parse("[cG] | |___| (_) | | (_) | |  | | | |_| | | [/]"),
    Color.parse("[cG]  \\_____\\___/|_|\\___/|_|  |_|  \\__,_|_| [/]"),
    '',
    Color.parse("[cB]  __  __ _    _ _____   [/]"),
    Color.parse("[cB] |  \\/  | |  | |  __ \\  [/]"),
    Color.parse("[cC] | \\  / | |  | | |  | | [/]"),
    Color.parse("[cC] | |\\/| | |  | | |  | | [/]"),
    Color.parse("[cM] | |  | | |__| | |__| | [/]"),
    Color.parse(`[cM] |_|  |_|\\____/|_____/  [/] [b][cW]Framework[/] [b][r][cr] v${package.version} [/]`),
    Color.parse('[cM]  \\'),
    Color.parse("   `-> [/] [u]https://github.com/ezobraz/colorful-mud-server-node.js[/]"),
    '',
];

module.exports = {
    async init() {

        Debug.raw(logo.join('\r\n'));

        await Modules.init();
        await Params.init();
        await Attributes.init();
        await Skills.init();
        await Dependents.init();
        await Items.init();
        await Actors.init();
        await Locations.init();
        Commands.init();
        Events.init();
        Cron.init();
        Server.init();

        Event.emit('SERVER_READY');
    }
}
