const Color = require('../../common/color');
const Config = require('../../config');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');
const Location = require('../../entities/locations');

const hasPermissions = require('../common/has-permissions');

module.exports = {
    names: ['location', 'loc'],
    permissions: ['list locations'],
    desc: 'You can edit locations or create new ones with this command',
    examples: [
        "location list - will output all the locations in game with their ID's",
        'location create my location - will create a new location with name "my location"',
        'location set desc this is something - will set current location\'s description to "this is something"',
        'location set img - will set current location\'s picture to whatever is in your canvas right now (see draw command)',
    ],
    async execute(player, text) {
        const words = text.split(' ');
        const actionStr = words[0];
        const action = this.actions[actionStr];

        words.shift();

        if (!action) {
            return;
        }

        if (!hasPermissions(action.permissions, player)) {
            return;
        }

        return action.execute(player, words.join(' '));
    },

    actions: {
        'set': {
            permissions: ['edit locations'],
            async execute(player, text) {
                if (!text.length) {
                    return;
                }

                let words = text.split(' ');

                if (!words.length) {
                    return;
                }

                if (!player.locationId) {
                    return;
                }

                let location = Store.findById('locations', player.locationId);

                if (!location) {
                    return;
                }

                let param = words[0];

                if (!['name', 'desc', 'img', 'type'].includes(param)) {
                    return;
                }

                words.shift();
                let val = words.join(' ');

                if (param == 'img') {
                    val = JSON.parse(JSON.stringify(player.meta.draw));
                }

                if (!val) {
                    return;
                }

                location[param] = val;
                location.save();

                return true;
            },
        },
        'create': {
            permissions: ['create locations'],
            async execute(player, name) {
                const location = new Location({
                    name,
                });

                let exists = await location.exists();

                if (exists) {
                    Broadcaster.system({
                        to: player,
                        text: `Location ${location.name} already exists`,
                    });
                    return;
                }

                await location.create();
                Store.add('locations', location);

                let startLocationId = await Config.getRuntime('startLocationId');
                if (!startLocationId) {
                    Config.setRuntime('startLocationId', location._id);
                    player.locationId = location._id;
                }

                Broadcaster.system({
                    to: player,
                    text: `[b][cW]${location.displayName}[/] successfully created: [b][cW]${location._id}[/]`,
                });

                return true;
            },
        },
        'list': {
            permissions: ['list locations'],
            execute(player) {
                const locations = Store.get('locations');
                const res = [
                    Color.parse(`[b][r][cW]${Color.align({ text: 'List of all locations in game' })}[/]`),
                    '',
                    ...locations.map(loc => `${Color.parse(`[cY]${loc.displayName}[/]: [b][cW]${loc._id}[/]`)}`),
                ];

                Broadcaster.sendTo({
                    to: player,
                    text: res.join('\r\n'),
                });
            },
        },
        'remove': {
            permissions: ['remove locations'],
            execute(player, id) {
                const location = Store.findById('locations', id);

                // players are here
                if (Object.keys(locationId.players).length) {
                    return;
                }

                // todo
                location.remove();
            },
        }
    },
};
