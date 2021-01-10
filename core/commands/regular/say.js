const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Debug = require('../../engine/debug');
const Store = require('../../store');

module.exports = {
    names: tran.slate('command-say-names'),
    desc: tran.slate('command-say-desc'),
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
            Color.parse(`${player.displayName} @ [cY]${location.name}[/]: [b]${text}[/]`),
            'CHAT',
        );

        location.players.forEach(ply => {
            Broadcaster.replica({
                to: ply,
                from: player,
                text,
            });
        });

        return true;
    }
}
