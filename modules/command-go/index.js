const Store = __require('core/store');
const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-go-names'),
            desc: tran.slate('command-go-desc'),
            examples: tran.slate('command-go-examples'),
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
        },
    ],
}
