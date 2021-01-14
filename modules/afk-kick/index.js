const Store = __require('core/store');
const { Debug } = __require('core/tools');

const afkTimeout = 1000 * 60 * 10;

module.exports = {
    cron: [
        {
            interval: 10000,
            execute() {
                const players = Store.get('players');
                const afkTimeLimit = Date.now() - afkTimeout;

                for (const player of players) {
                    if (player.lastInput <= afkTimeLimit) {
                        player.disconnect('Timeout');
                    }
                }
            },
        },
    ],
}
