const Store = __require('core/store');
const { Color, Broadcaster } = __require('core/tools');

module.exports = [
    {
        names: ['teleport to location', 'tp to loc'],
        permissions: ['teleport to locations'],
        desc: 'Teleports tou to specified location',
        examples: [
            'teleport to location 3oQ4Ab34d',
            'tp to loc 3oQ4Ab34d',
        ],
        async execute(player, text) {
            const location = Store.findById('locations', text);

            if (!location) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse(`[b][cR]There is no location with such ID[/]`),
                });
                return;
            }

            player.changeLocation(location);

            Broadcaster.sendTo({
                to: player,
                text: Color.parse(`[b][cC]Teleported to ${location.name}[/]`),
            });
        },
    },
];
