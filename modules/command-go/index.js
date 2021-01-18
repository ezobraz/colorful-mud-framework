const Store = __require('core/store');
const { Color, Broadcaster } = __require('core/tools');

const changeLocation = (player, to, from) => {
    player.locationId = to._id;

    from.notifyAll({
        text: Color.parse(`${player.name} left`),
        exclude: player,
    });

    to.notifyAll({
        text: Color.parse(`${player.name} appeared here`),
        exclude: player,
    });

    Debug.log(Color.parse(`${player.displayName} went from [b]${from.displayName}[/] to [b]${to.displayName}[/]`), 'MOVE');
};

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

                const from = Store.findById('locations', player.locationId);
                if (!from) {
                    return;
                }

                const index = parseInt(text) - 1;
                const locationId = from.exits[index];
                if (!locationId) {
                    return;
                }

                const to = Store.findById('locations', locationId);
                if (!to) {
                    return;
                }

                changeLocation(player, to, from);

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
