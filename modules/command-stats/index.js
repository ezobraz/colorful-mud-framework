const { Color, Broadcaster } = __require('core/tools');
const Config = __require('core/config');

module.exports = {
    commands: [
        {
            names: tran.slate('command-stats-names'),
            execute(player) {
                const stats = {
                    'params': player.params,
                    'attributes': player.attributes,
                    'dependents': player.dependents,
                    'skills': player.skills,
                };

                const res = [
                    Color.parse(`[r]${ Color.align({ text: tran.slate('window-name-stats') }) }[/]`),
                    '',
                    Color.parse(`[b][cW]${tran.slate('player-name')}:[/] ${player.displayName}`),
                    Color.parse(`[b][cW]${tran.slate('player-money')}:[/] ${Color.price(player.money)}`),
                    '',
                ];

                for (let i in stats) {
                    // res.push(Color.parse(`[b][u]${ Color.align({ text: tran.slate(`player-${i}`), align: 'left' }) }[/]`));

                    const pack = stats[i];
                    const tmp = [];

                    for (let key in pack) {
                        const name = tran.slate(`player-${i}-${pack[key].class.toLowerCase()}`);

                        let data;

                        switch(i) {
                            case 'params':
                                data = `${pack[key].level}/${pack[key].max(player)}`;
                                break;
                            case 'dependents':
                                data = pack[key].level(player).toString();
                                break;
                            default:
                                data = pack[key].level.toString();
                                break;
                        }

                        tmp.push([
                            Color.parse(`[b][cW]${name}[/]`),
                            Color.parse(`[b][cW]${data}[/]`),
                        ]);
                    }

                    if (tmp.length) {
                        res.push(...Color.dottedList({ data: tmp, cols: 2 }));
                    }

                    if (i != 'skills') {
                        res.push('');
                    }
                }

                const text = `${res.join('\r\n')}`;

                Broadcaster.sendTo({
                    to: player,
                    text,
                });
            }
        }
    ],
}
