const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

module.exports = [
    {
        names: ['show system ram', 'show sys ram'],
        permissions: ['system'],
        desc: 'Shows system ram usage',
        examples: [
            'show system ram',
            'show sys ram',
        ],
        async execute(player, text) {
            let usedMb = process.memoryUsage().heapUsed / 1024 / 1024;
            let used = Math.round(usedMb * 100) / 100;

            let color = 'cg';

            if (used > 100) {
                color = 'cY';
            }

            if (used > 300) {
                color = 'cR';
            }

            let res = `Ram used: ${Color.parse(`[${color}]${used} mb[/]`)}`;

            Broadcaster.sendTo({
                to: player,
                text: res,
            });

            return true;
        },
    },
];
