const Store = __require('core/store');
const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-look-names'),
            desc: tran.slate('command-look-desc'),
            execute(player) {
                if (!player.locationId) {
                    Broadcaster.sendTo({
                        to: player,
                        text: tran.slate('location-empty'),
                    });
                    return;
                }

                let location = Store.findById('locations', player.locationId);

                if (!location) {
                    return;
                }

                const showIds = player.permissions.includes('see location id');

                let res = [
                    Color.parse(`[b][r][${location.color}]${ Color.align({ text: location.name }) }[/]`),
                ];

                if (showIds) {
                    res.push(location._id);
                }

                res.push('');

                if (location.img && location.img.length) {
                    res.push(...[
                        Color.img(location.img),
                        '',
                    ]);
                }

                if (location.desc) {
                    res.push(...[
                        Color.wrap(location.desc),
                        '',
                    ]);
                }

                if (location.players.length > 0) {
                    res.push();

                    const playerNames = location.players.map(ply => Color.parse(ply.displayName));

                    res.push(
                        ...[
                            Color.parse(`[b][u][cW]${tran.slate('location-players-nearby')}:[/]`),
                            ...Color.list(playerNames, 4),
                            '',
                        ],
                    );
                }

                if (location.items.length) {
                    const items = location.items.map(item => Color.parse(item.displayName));

                    res.push(
                        ...[
                            Color.parse(`[b][u][cW]${tran.slate('location-items')}:[/]`),
                            ...items.length > 10 ? Color.list(items, 4) : items,
                            '',
                        ],
                    );
                }

                if (location.exits.length) {
                    const exits = location.exits.map((id, index) => {
                        const exit = Store.findById('locations', id);

                        let str = `${index + 1}. `;

                        if (exit.locked) {
                            str += '[locked] ';
                        }

                        str += `${exit.displayName}`;

                        if (showIds) {
                            str += `: [b][cW]${exit._id}[/]`;
                        }

                        return Color.parse(str);
                    });

                    res.push(
                        ...[
                            Color.parse(`[b][u][cW]${tran.slate('location-exits')}:[/]`),
                            ...exits.length > 10 ? Color.list(exits, 4) : exits,
                            '',
                        ],
                    );
                }

                Broadcaster.sendTo({
                    to: player,
                    text: res.join('\r\n'),
                });
            }
        }
    ],
}
