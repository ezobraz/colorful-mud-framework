const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

module.exports = {
    names: ['look', 'ls'],
    desc: 'Look around',
    examples: [
        'look',
    ],
    execute(player, text) {
        if (!player.locationId) {
            Broadcaster.sendTo({
                to: player,
                text: 'You are in emptyness...',
            });
            return;
        }

        let location = Store.findById('locations', player.locationId);

        if (!location) {
            return;
        }

        let res = [
            '',
            Color.parse(`[r][cY] ${location.name} [/]`),
            '',
        ];

        if (location.img && location.img.length) {
            res.push(...[
                Color.img(location.img),
                '',
            ]);
        }

        if (location.desc) {
            res.push(...[
                Color.wrap(location.desc),
                '',
            ]);
        }

        if (location.players.length > 0) {
            res.push(Color.parse(`[b][cW]Players nearby:[/]`));

            const playerNames = location.players.map(ply => Color.parse(`[b][cY]${ply.name}[/]`));

            res.push(...Color.list(playerNames, 4));
        }

        if (location.items.length) {
            const itemNames = location.items.map(item => Color.parse(`[b][cC]${item.name}[/]`));

            res.push(
                ...[
                    '',
                    Color.parse(`[b][cW]Items:[/]`),
                ],
                ...Color.list(itemNames, 4),
            );

        }

        Broadcaster.sendTo({
            to: player,
            text: res.join('\r\n'),
        });
    }
};
