const Locations = require('./locations');
const Events = require('./events');
const Server = require('./server');
const Cron = require('./cron');

const init = async() => {
    await Locations.init();
    Events.init();
    Server.init();
    Cron.init();
};

module.exports = {
    init,
}
