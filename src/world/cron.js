const Store = require('../store');
const Config = require('../config');
const Debug = require('../engine/debug');

const logRam = Config.get('debug.logRam');
const afkTimeout = Config.get('players.afkTimeout');

const tasks = {
    // 10 sec
    10000: () => {
        const players = Store.get('players');
        const afkTimeLimit = Date.now() - afkTimeout;

        for (const player of players) {
            if (player.lastInput <= afkTimeLimit) {
                player.disconnect('Timeout');
            }
        }
    },
    // 1 min
    60000: () => {
        if (logRam) {
            Debug.memory();
        }
    }
}

const running = {};

module.exports = {
    async init() {
        for (let key in tasks) {
            running[key] = setInterval(tasks[key], key);
        }

        Debug.status('Cron tasks initialized', Object.keys(tasks).length);
    }
};
