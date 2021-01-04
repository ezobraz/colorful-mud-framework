const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Debug = require('../../engine/debug');
const Store = require('../../store');

module.exports = {
    names: ['say', 's'],
    desc: 'Sends chat command to all players in your current location.',
    examples: [
        'say hello!',
        'say how are you?',
    ],
    execute(player, text) {
        if (!text.length) {
            return;
        }

        if (!player.locationId) {
            return;
        }

        let location = Store.findById('locations', player.locationId);

        if (!location) {
            return;
        }

        Debug.log(
            Color.parse(`[b][u]${player.name}[/] @ [cY]${location.name}[/]: [b]${text}[/]`),
            'CHAT',
        );

        location.players.forEach(ply => {
            if (ply._id !== player._id) {
                Broadcaster.replica({
                    to: ply,
                    from: player,
                    text,
                });
            }
        });
    }
}
