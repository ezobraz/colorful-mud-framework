const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

module.exports = {
    names: ['inventory', 'inv'],
    desc: 'Shows the list of items in your inventory',
    examples: [
        'inventory',
    ],
    execute(player) {
        const inventory = player.inventory;

        const res = [
            Color.parse(`[b][r][cW]${ Color.align({ text: 'Inventory' }) }[/]`),
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

            const addStrWeight = new Array(paramLength - 'Weight'.length - item.weight.toString().length + 1).join('.');
            outputData.push(Color.parse(`Weight${addStrWeight}${item.weight}`));

            const addStrCond = new Array(paramLength - 'Condition'.length - item.condition.toString().length).join('.');
            outputData.push(Color.parse(`Condition${addStrCond}${item.condition}%`));

            const addSttValue = new Array(paramLength - 'Price'.length - item.value.toString().length).join('.');
            outputData.push(Color.parse(`Price${addSttValue}${item.value}g`));

            res.push(...[
                Color.parse(item.displayName),
                ...Color.list(outputData, 2),
                '',
            ]);
        });

        if (!player.inventory.length) {
            res.push(
                Color.parse(`[b][cW]${ Color.align({ text: "It's empty" }) }[/]`),
            );
        }

        Broadcaster.sendTo({
            to: player,
            text: res.join('\r\n'),
        });
    }
};
