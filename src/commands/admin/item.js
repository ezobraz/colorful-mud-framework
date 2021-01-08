const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

const hasPermissions = require('../common/has-permissions');

const TYPES = [
    'sword',
];

const actions = {
    'typeinfo': {
        permissions: ['item typeinfo'],
        async execute(player, words) {
            const params = words.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const type = params[0];
            params.shift();

            if (!TYPES.includes(type)) {
                return;
            }

            const itemClass = require(`../../entities/items/${type}`);
            const item = new itemClass();
            const itemProps = item.props;

            const res = [
                Color.parse(`[b][r][cY] Default ${type} props [/]`),
            ];

            for (let i in itemProps) {
                res.push(Color.parse(`[b][cY]${i}[/]: ${itemProps[i]}`));
            }

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },
    'create': {
        permissions: ['item create'],
        execute(player, words) {
            const params = words.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const type = params[0];
            params.shift();

            if (!TYPES.includes(type)) {
                return;
            }

            const itemClass = require(`../../entities/items/${type}`);
            const item = new itemClass();
            const itemProps = item.props;
            const props = {};

            params.forEach((param, i) => {
                const data = param.split('=');
                const value = data[1].replace(/"+/g, '');

                if (typeof itemProps[data[0]] != 'undefined') {
                    props[data[0]] = value;
                }
            });

            item.props = props;

            player.addItem(item);
            player.save();
            Broadcaster.sendTo({
                to: player,
                text: Color.parse(`[b][cW]"${item.name}" ${type}[/] was [b][cG]added[/] to your inventory`),
            });
        },
    },
    'destroy': {
        permissions: ['item destroy'],
        async execute(player, words) {
            const params = words.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const name = params[0].replace(/"+/g, '');
            const item = player.inventory.find(i => i.name == name);

            if (item) {
                player.removeItem(item);
                player.save();
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse(`[b][cW]"${item.name}" ${item.className.toLowerCase()}[/] was [b][cR]destroyed[/]`),
                });
            }
        },
    },
};

module.exports = {
    names: ['item'],
    permissions: ['item create'],
    desc: 'With this command you can create or destroy items',
    examples: [
        'item create sword name="Big Stick" sharpness=1.0 - will create a sword with name "Big Stick" and 1.0 sharpness in your inventory',
        'item typeinfo sword - will output all props you can pass when creating a sword',
    ],
    async execute(player, text) {
        const params = text.split(' ');
        const actionStr = params[0];
        const action = actions[actionStr];

        params.shift();

        if (!action) {
            return;
        }

        // doesn't have permissions
        if (!hasPermissions(action.permissions, player)) {
            return;
        }

        return action.execute(player, params.join(' '));
    },
};
