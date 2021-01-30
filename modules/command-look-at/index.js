const { Color, Broadcaster } = __require('core/tools');
const Store = __require('core/store');

module.exports = {
    commands: [
        {
            names: tran.slate('command-look-at-names'),
            desc: tran.slate('command-look-at-desc'),
            execute(player, text) {
                const location = Store.findById('locations', player.locationId);
                if (!location) {
                    return;
                }

                const compareStr = text.toLowerCase();
                const character = location.characters.find(char => char.name.toLowerCase() == compareStr);

                if (!character) {
                    return;
                }

                const params = character.params.map(param =>
                    Color.parse(`[b]${param.shortName}[/] `) + Color.progress({
                        bgColor: param.bgColor,
                        textColor: param.textColor,
                        val: param.level,
                        max: param.max(character),
                })).join(' ');

                const stats = [];
                character.attributes.forEach((obj, i) => {
                    stats[i] = [`${obj.class}: ${obj.level}`];
                });
                character.dependents.forEach((obj, i) => {
                    stats[i].push(`${obj.class}: ${obj.level(character)}`);
                });
                character.skills.forEach((obj, i) => {
                    stats[i].push(`${obj.class}: ${obj.level}`);
                });

                const res = [
                    ...Color.table({
                        title: Color.parse(character.displayName) + '  ' + params,
                        data: [
                            [
                                Color.parse("[b][cW]Attributes[/]"),
                                Color.parse("[b][cW]Dependents[/]"),
                                Color.parse("[b][cW]Skills[/]"),
                            ],
                            ...stats,
                        ],
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
