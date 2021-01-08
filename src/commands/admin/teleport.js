const Color = require('../../common/color');
const Store = require('../../store');
const Broadcaster = require('../../engine/broadcaster');

const hasPermissions = require('../common/has-permissions');

const actions = {
    'location': {
        permissions: ['teleport to locations'],
        async execute(player, locationId) {
            const location = Store.findById('locations', locationId);

            if (!location) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse(`[b][cR]There is no location with such ID[/]`),
                });
                return;
            }

            player.changeLocation(location);

            Broadcaster.sendTo({
                to: player,
                text: Color.parse(`[b][cC]Teleported to ${location.name}[/]`),
            });
        },
    },
};

module.exports = {
    names: ['teleport', 'tp'],
    permissions: ['teleport to locations'],
    desc: 'Teleport to player or location',
    examples: [
        'teleport location 3oQ4Ab34d',
    ],
    async execute(player, text) {
        const words = text.split(' ');
        const actionStr = words[0];
        const action = actions[actionStr];

        words.shift();

        if (!action) {
            return;
        }

        if (!hasPermissions(action.permissions, player)) {
            return;
        }

        return action.execute(player, words.join(' '));
    },
};
