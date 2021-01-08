const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

module.exports = {
    names: ['take', 'grab'],
    desc: 'Pick up the specified item from the ground and',
    examples: [
        'take long sword',
        'grab long sword',
    ],
    execute(player, text) {
        if (!player.locationId) {
            return;
        }

        if (!text) {
            return;
        }

        const location = Store.findById('locations', player.locationId);

        if (!location) {
            return;
        }

        const name = text.toLowerCase();
        const item = location.items.find(i => i.name.toLowerCase() == name);

        if (!item) {
            return;
        }

        location.removeItem(item);
        player.addItem(item);

        location.save();
        player.save();

        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`You've picked up ${item.displayName}`),
        });
        location.notifyAll({
            exclude: player,
            text: Color.parse(`${player.displayName} has picked up ${item.displayName}`),
        });

        return true;
    }
};
