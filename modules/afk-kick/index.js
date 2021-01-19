const { Debug } = __require('core/tools');
const Store = __require('core/store');
const Event = __require('core/event');

const afkTimeout = 1000 * 60 * 10; // 10 minutes

module.exports = {
    init() {
        Event.on('PLAYER_MESSAGE', ({ player, message }) => {
            player.tmp.lastInput = Date.now();
        });
    },

    cron: [
        {
            interval: 10000,
            execute() {
                const players = Store.get('players');
                const afkTimeLimit = Date.now() - afkTimeout;

                for (const player of players) {
                    if (player.tmp.lastInput && player.tmp.lastInput <= afkTimeLimit) {
                        player.disconnect('Timeout');
                    }
                }
            },
        },
    ],
}
