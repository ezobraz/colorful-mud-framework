const Modules = require('./modules');
const Params = require('./params');
const Attributes = require('./attributes');
const Skills = require('./skills');
const Items = require('./items');
const Actors = require('./actors');
const Locations = require('./locations');
const Commands = require('./commands');
const Events = require('./events');
const Server = require('./server');
const Cron = require('./cron');
const Event = require('../common/event');

module.exports = {
    async init() {
        await Modules.init();
        await Params.init();
        await Attributes.init();
        await Skills.init();
        await Items.init();
        await Actors.init();
        await Locations.init();
        Commands.init();
        Events.init();
        Server.init();
        Cron.init();

        Event.emit('serverReady');
    }
}
