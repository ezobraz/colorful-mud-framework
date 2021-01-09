const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

const TYPES = [
    'sword',
];

module.exports = [
    {
        names: ['create item'],
        permissions: ['create items'],
        desc: 'Spawns specified item in your inventory',
        examples: [
            'create item sword name="Long Sword"',
            'create item sword name="Stick" quality=100',
        ],
        async execute(player, text) {
            const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
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
    {
        names: ['delete item'],
        permissions: ['delete items'],
        desc: 'Destroys specified item from your inventory',
        examples: [
            'delete item Long Sword',
        ],
        async execute(player, text) {
            const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
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
];
