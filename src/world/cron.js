const Store = require('../store');
const Config = require('../config');
const Debug = require('../engine/debug');

const logRam = Config.get('debug.logRam');
const afkTimeout = Config.get('players.afkTimeout');

const tasks = () => {
    const players = Store.get('players');
    const afkTimeLimit = Date.now() - afkTimeout;

    for (const player of players) {
        if (player.lastInput <= afkTimeLimit) {
            player.disconnect('Timeout');
        }
    }

    if (logRam) {
        Debug.memory();
    }
};

module.exports = {
    async init() {
        setInterval(tasks, 10000);
        Debug.status('Cron initialized');
    }
};
