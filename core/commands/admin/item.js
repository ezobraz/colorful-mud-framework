const { Color, Broadcaster } = __require('core/tools');
const Dictionary = __require('core/dictionary');

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

            const itemClass = Dictionary.get('items', type);

            if (!itemClass) {
                return;
            }

            const item = new itemClass();

            params.forEach((param, i) => {
                const data = param.split('=');
                const value = data[1].replace(/"+/g, '');

                if (typeof item[data[0]] != 'undefined') {
                    item[data[0]] = value;
                }
            });

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
                    text: Color.parse(`[b][cW]"${item.name}" ${item.class.toLowerCase()}[/] was [b][cR]destroyed[/]`),
                });
            }
        },
    },
];
