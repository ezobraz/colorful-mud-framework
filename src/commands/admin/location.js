const Color = require('../../common/color');
const Config = require('../../config');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

const setParams = [
    'name',
    'desc',
    'img',
    'type',
    'exit',
    'exit-bind',
];

const locTypes = [
    'castle',
    'town',
    'village',
    'nature',
    'dungeon',
    'room',
];

module.exports = [
    {
        names: ['list locations', 'list loc'],
        permissions: ['see location id'],
        desc: 'See all locations in game',
        examples: [
            'list locations',
            'list loc',
        ],
        async execute(player) {
            const locations = Store.get('locations');
            const res = [
                Color.parse(`[b][r][cW]${Color.align({ text: 'List of all locations in game' })}[/]`),
                '',
                ...locations.map(loc => `${Color.parse(`${loc.displayName}: [b][cW]${loc._id}[/]`)}`),
            ];

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },
    {
        names: ['delete location', 'delete loc'],
        permissions: ['delete locations'],
        desc: 'Delete current location',
        examples: [
            'delete location',
            'delete loc',
        ],
        execute(player, id) {
            const location = Store.findById('locations', id);

            // players are here
            if (Object.keys(locationId.players).length) {
                return;
            }

            location.remove();
            return true;
        },
    },
    {
        names: ['create location', 'create loc'],
        permissions: ['create locations'],
        desc: 'Creates new location',
        examples: [
            'create location Some Location Name',
            'create loc Some Location Name',
        ],
        async execute(player, text) {
            const words = text.split(' ');
            if (words.length < 2) {
                return;
            }

            const type = words[0];

            if (!locTypes.includes(type)) {
                return;
            }

            words.shift();

            const name = words.join(' ');

            const Location = require(`../../entities/locations/${type}`);
            const loc = new Location({
                name,
            });

            let exists = await loc.exists();

            if (exists) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse(`Location ${loc.name} already exists`),
                });
                return;
            }

            await loc.create();
            Store.add('locations', loc);

            let startLocationId = await Config.getRuntime('startLocationId');
            if (!startLocationId) {
                Config.setRuntime('startLocationId', loc._id);
                player.locationId = loc._id;
            }

            Broadcaster.sendTo({
                to: player,
                text: Color.parse(`${loc.displayName} successfully created: [b][cW]${loc._id}[/]`),
            });

            return true;
        },
    },
    {
        names: ['unset location', 'unset loc'],
        permissions: ['edit locations'],
        desc: 'Reset location parameter',
        examples: [
            'unset location img',
            'unset location desc some description',
            'unset loc exit-bind sad121',
        ],
        async execute(player, text) {
            if (!text) {
                return;
            }

            const words = text.split(' ');

            if (!words.length) {
                return;
            }

            const param = words[0];
            words.shift();
            let val = words.join(' ');

            if (!setParams.includes(param)) {
                return;
            }

            if (!player.locationId) {
                return;
            }

            let location = Store.findById('locations', player.locationId);

            if (!location) {
                return;
            }

            if (param == 'img') {
                val = [];
            }

            if (param == 'exit') {
                location.removeExit(val);
                location.save();
                return true;
            }

            if (param == 'exit-bind') {
                location.removeExit(val);
                location.save();

                const otherLocation = Store.findById('locations', val);

                if (otherLocation) {
                    otherLocation.removeExit(location._id);
                    otherLocation.save();
                }
                return true;
            }

            location[param] = val;
            location.save();
            return true;
        },
    },
    {
        names: ['set location', 'set loc'],
        permissions: ['edit locations'],
        desc: 'Set location parameter to whatever you provide',
        examples: [
            'set location img - it will grab the image you have in your canvas (draw show)',
            'set location desc some description',
            'set loc exit-bind sad121',
        ],
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

            if (!setParams.includes(param)) {
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

            if (param == 'exit') {
                location.addExit(val);
                location.save();
                return true;
            }

            if (param == 'exit-bind') {
                location.addExit(val);
                location.save();

                const otherLocation = Store.findById('locations', val);

                if (otherLocation) {
                    otherLocation.addExit(location._id);
                    otherLocation.save();
                }
                return true;
            }

            location[param] = val;
            location.save();
            return true;
        },
    },
];
