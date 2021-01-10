const Modules = require('./modules');
const Params = require('./params');
const Attributes = require('./attributes');
const Skills = require('./skills');
const Locations = require('./locations');
const Events = require('./events');
const Server = require('./server');
const Cron = require('./cron');

const init = async() => {
    await Modules.init();
    await Params.init();
    await Attributes.init();
    await Skills.init();
    await Locations.init();
    Events.init();
    Server.init();
    Cron.init();
};

module.exports = {
    init,
}
