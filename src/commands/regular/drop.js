const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

module.exports = {
    names: ['drop', 'place'],
    desc: 'Places the specified item from your inventory to the ground',
    examples: [
        'drop long sword',
    ],
    execute(player, text) {
        if (!player.locationId) {
            return;
        }

        if (!text) {
            return;
        }

        const name = text.toLowerCase();
        const item = player.inventory.find(i => i.name.toLowerCase() == name);

        if (!item) {
            return;
        }

        const location = Store.findById('locations', player.locationId);

        if (!location) {
            return;
        }

        location.addItem(item);
        player.removeItem(item);

        location.save();
        player.save();

        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`You've dropped ${item.displayName}`),
        });
        location.notifyAll({
            exclude: player,
            text: Color.parse(`${player.displayName} has dropped ${item.displayName}`),
        });

        return true;
    }
};
