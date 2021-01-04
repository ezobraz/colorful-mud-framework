const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

const hasPermissions = require('../common/has-permissions');

const actions = {
    'ram': {
        permissions: ['system'],
        async execute(player) {
            let usedMb = process.memoryUsage().heapUsed / 1024 / 1024;
            let used = Math.round(usedMb * 100) / 100;

            let color = 'cg';

            if (used > 100) {
                color = 'cY';
            }

            if (used > 300) {
                color = 'cR';
            }

            let text = `Ram used: ${Color.parse(`[${color}]${used} mb[/]`)}`;

            Broadcaster.sendTo({
                to: player,
                text,
            });

            return true;
        },
    },
};

module.exports = {
    names: ['system', 'sys'],
    permissions: ['system'],
    desc: 'Shows system info',
    examples: [
        'system ram',
    ],
    async execute(player, text) {
        const words = text.split(' ');
        const actionStr = words[0];
        const action = actions[actionStr];

        words.shift();

        if (!action) {
            return;
        }

        // doesn't have permissions
        if (!hasPermissions(action.permissions, player)) {
            return;
        }

        return action.execute(player, words.join(' '));
    },
};
