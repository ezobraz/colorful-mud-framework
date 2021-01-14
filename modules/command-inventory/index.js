const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-inventory-names'),
            desc: tran.slate('command-inventory-desc'),
            execute(player) {
                const inventory = player.inventory;

                const res = [
                    Color.parse(`[b][r][cW]${ Color.align({ text: tran.slate('window-name-inventory') }) }[/]`),
                    '',
                ];

                const paramLength = 30;

                player.inventory.forEach(item => {
                    let outputData = item.outputData || [];

                    outputData = outputData.map(data => {
                        let add = paramLength - data.name.length - data.value.toString().length;
                        let addStr = new Array(add + 1).join('.');

                        return Color.parse(`${data.name}${addStr}${data.value}`);
                    });

                    const addStrWeight = new Array(paramLength - tran.slate('item-param-weight').length - item.weight.toString().length + 1).join('.');
                    outputData.push(Color.parse(tran.slate('item-param-weight') + addStrWeight + item.weight));

                    const addStrCond = new Array(paramLength - tran.slate('item-param-condition').length - item.condition.toString().length).join('.');
                    outputData.push(Color.parse(tran.slate('item-param-condition') + addStrCond + item.condition + '%'));

                    const addSttValue = new Array(paramLength - tran.slate('item-param-value').length - item.value.toString().length).join('.');
                    outputData.push(Color.parse(tran.slate('item-param-value') + addSttValue + item.value + 'g'));

                    res.push(...[
                        Color.parse(item.displayName),
                        ...Color.list(outputData, 2),
                        '',
                    ]);
                });

                if (!player.inventory.length) {
                    res.push(
                        Color.parse(`[b][cW]${ Color.align({ text: tran.slate('inventory-empty') }) }[/]`),
                    );
                }

                Broadcaster.sendTo({
                    to: player,
                    text: res.join('\r\n'),
                });
            }
        },
    ],
}
