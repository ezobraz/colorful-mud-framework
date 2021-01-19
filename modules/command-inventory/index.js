const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-inventory-names'),
            desc: tran.slate('command-inventory-desc'),
            execute(player) {
                const res = Color.table({
                    title: tran.slate('window-name-inventory'),
                    data: [
                        [
                            tran.slate('item-param-id'),
                            tran.slate('item-param-type'),
                            tran.slate('item-param-name'),
                            tran.slate('item-param-weight'),
                            tran.slate('item-param-quality'),
                            tran.slate('item-param-condition'),
                            tran.slate('item-param-value')
                        ],
                        ...player.inventory.map((item, i) => [
                            i + 1,
                            item.displayClass,
                            Color.parse(item.displayName),
                            Color.parse(item.displayWeight),
                            Color.parse(item.displayQuality),
                            Color.parse(item.displayCondition),
                            Color.parse(item.displayValue),
                        ]),
                    ],
                });

                Broadcaster.sendTo({
                    to: player,
                    text: res.join('\r\n'),
                });
            }
        },
    ],
}
