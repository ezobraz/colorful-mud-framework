const { Color, Broadcaster } = __require('core/tools');
const Store = __require('core/store');

module.exports = {
    commands: [
        {
            names: tran.slate('command-look-at-item-names'),
            desc: tran.slate('command-look-at-item-desc'),
            execute(player, text) {
                let itemId;
                let items = [];

                // look in inventory
                if (text.includes(tran.slate('in-inventory'))) {
                    itemId = parseInt(text.replace(tran.slate('in-inventory'), ''));
                    items = player.inventory;
                // look in location
                } else {
                    const location = Store.findById('locations', player.locationId);
                    if (!location) {
                        return;
                    }

                    itemId = parseInt(text);
                    items = location.items;
                }

                const item = items[itemId - 1];

                if (!item) {
                    return;
                }

                const res = [
                    Color.parse(item.displayName),
                    ...Color.dottedList({
                        data: [
                            [
                                tran.slate('item-param-rare'),
                                Color.parse(item.displayRare),
                            ],
                            [
                                tran.slate('item-param-weight'),
                                Color.parse(item.displayWeight),
                            ],
                            ...item.outputData.map(data => [Color.parse(data[0]), Color.parse(data[1])]),
                            [
                                tran.slate('item-param-quality'),
                                Color.parse(item.displayQuality),
                            ],
                            [
                                tran.slate('item-param-condition'),
                                Color.parse(item.displayCondition),
                            ],
                            [
                                tran.slate('item-param-value'),
                                Color.parse(item.displayValue),
                            ],
                        ],
                        cols: 2,
                        separator: '  ',
                    }),
                ];

                Broadcaster.sendTo({
                    to: player,
                    text: res.join('\r\n'),
                });
            }
        },
    ],
}
