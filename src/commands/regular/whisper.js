const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Debug = require('../../engine/debug');
const Store = require('../../store');

module.exports = {
    names: ['whisper', 'w'],
    desc: 'Sends private message to nearby player in your current location.',
    examples: [
        'whisper playername hello',
        'w playername hi',
    ],
    execute(player, text) {
        if (!text) {
            return;
        }

        if (!player.locationId) {
            return;
        }

        const location = Store.findById('locations', player.locationId);

        if (!location) {
            return;
        }

        const words = text.split(' ');

        if (words.length < 2) {
            return;
        }

        const name = words[0];

        if (!name) {
            return;
        }

        words.shift();
        text = words.join(' ');

        if (!text) {
            return;
        }

        const compareName = name.toLowerCase();
        const players = Store.findAll('players', 'locationId', location._id);
        const to = players.find(ply => ply.name.toLowerCase() == compareName);

        if (!to) {
            return;
        }

        Debug.log(
            Color.parse(`[u][b]${player.name}[/] [cM]whispers to[/] [u][b]${to.name}[/] @ [cY]${location.name}[/]: [b]${text}[/]`),
            'CHAT',
        );

        Broadcaster.sendTo({
            to,
            text: Color.parse(`[b][cM]${player.name}: ${text}[/]`),
        });
        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`[b][cM]You whisper to ${to.name}: ${text}[/]`),
        });

        return true;
    }
}
