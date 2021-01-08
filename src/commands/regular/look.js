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

        const showIds = player.permissions.includes('list locations');

        let res = [
            Color.parse(`[b][r][${location.color}]${ Color.align({ text: location.displayName }) }[/]`),
        ];

        if (showIds) {
            res.push(location._id);
        }

        res.push('');

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
            res.push();

            const playerNames = location.players.map(ply => Color.parse(ply.displayName));

            res.push(
                ...[
                    Color.parse(`[b][u][cW]Players nearby:[/]`),
                    ...Color.list(playerNames, 4),
                    '',
                ],
            );
        }

        if (location.items.length) {
            const items = location.items.map(item => Color.parse(item.displayName));

            res.push(
                ...[
                    Color.parse(`[b][u][cW]Items:[/]`),
                    ...items.length > 10 ? Color.list(items, 4) : items,
                    '',
                ],
            );
        }

        if (location.exits.length) {
            const exits = location.exits.map((id, index) => {
                const exit = Store.findById('locations', id);

                let str = `${index + 1}. `;

                if (exit.locked) {
                    str += '[locked] ';
                }

                str += `[b][${exit.color}]${exit.displayName}[/]`;

                if (showIds) {
                    str += `: [b][cW]${exit._id}[/]`;
                }

                return Color.parse(str);
            });

            res.push(
                ...[
                    Color.parse(`[b][u][cW]Exits:[/]`),
                    ...exits.length > 10 ? Color.list(exits, 4) : exits,
                    '',
                ],
            );
        }

        Broadcaster.sendTo({
            to: player,
            text: res.join('\r\n'),
        });
    }
};
