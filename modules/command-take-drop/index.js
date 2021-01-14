const Store = __require('core/store');
const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        // take
        {
            names: tran.slate('command-take-names'),
            desc: tran.slate('command-take-desc'),
            examples: tran.slate('command-take-examples'),
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
        },

        // drop
        {
            names: tran.slate('command-drop-names'),
            desc: tran.slate('command-drop-desc'),
            examples: tran.slate('command-drop-examples'),
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
        },
    ],
}
