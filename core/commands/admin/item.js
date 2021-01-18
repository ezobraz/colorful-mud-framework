const { Color, Broadcaster } = __require('core/tools');
const Dictionary = __require('core/dictionary');

module.exports = [
    // list types
    {
        names: tran.slate('command-list-item-types-names'),
        desc: tran.slate('command-list-item-types-desc'),
        permissions: ['list item types'],
        async execute(player) {
            const itemTypes = Dictionary.get('items');

            let res = [];

            for (let i in itemTypes) {
                const itemClass = new itemTypes[i];

                const params = itemClass.setters.map(key => `${key}: ${itemClass[key]}`);

                res.push(
                    Color.parse(`[b][cY][r] ${itemClass.class} [/]`),
                    ...params,
                    '',
                );
            }

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },

    // create
    {
        names: tran.slate('command-create-item-names'),
        desc: tran.slate('command-create-item-desc'),
        examples: tran.slate('command-create-item-examples'),
        permissions: ['create items'],
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

    // delete
    {
        names: tran.slate('command-delete-item-names'),
        desc: tran.slate('command-delete-item-desc'),
        examples: tran.slate('command-delete-item-examples'),
        permissions: ['delete items'],
        async execute(player, text) {
            const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const name = params[0].replace(/"+/g, '').toLowerCase();
            const item = player.inventory.find(i => i.name.toLowerCase() == name);

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
