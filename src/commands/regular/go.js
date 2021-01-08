const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

module.exports = {
    names: ['go', 'move'],
    desc: 'Go to specified location name or index (see exits section)',
    examples: [
        'go 1',
        'move 2',
    ],
    execute(player, text) {
        if (!player.locationId) {
            return;
        }

        if (!text) {
            return;
        }

        const index = parseInt(text) - 1;
        const currentLocation = Store.findById('locations', player.locationId);

        if (!currentLocation) {
            return;
        }

        const locationId = currentLocation.exits[index];

        if (!locationId) {
            return;
        }

        const location = Store.findById('locations', locationId);

        if (!location) {
            return;
        }

        player.changeLocation(location);
        player.save();
        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`[b][cY]You've moved to ${location.name}[/]`),
        });

        return true;
    }
};
