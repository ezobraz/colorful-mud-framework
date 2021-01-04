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

        let playerIcons = [
            '',
            '',
            '',
            '',
        ];

        let locPlayers = location.players.slice(0, 10);

        locPlayers.forEach((ply, index) => ply.icon.forEach((line, i) => playerIcons[i] += line));

        res.push(...playerIcons);

        if (location.desc) {
            res.push(...[
                Color.wrap(location.desc),
                '',
            ]);
        }

        if (locPlayers.length > 0) {
            res.push(...[
                Color.parse(`Players nearby:`),
                '',
            ]);

            const names = locPlayers.map(ply => Color.parse(`[b][cY]${ply.name}[/]`));

            res.push(...Color.list(names, 4));
        }

        Broadcaster.sendTo({
            to: player,
            text: res.join('\r\n'),
        });
    }
};
