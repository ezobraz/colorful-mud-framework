const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Config = require('../../config');

const lineLength = Config.get('format.lineLength');
const statLineLength = lineLength / 2 - 1;

module.exports = {
    names: tran.slate('command-stats-names'),
    desc: tran.slate('command-stats-desc'),
    execute(player) {
        const params = {
            'params': player.params,
            'attributes': player.attributes,
            'skills': player.skills,
        };

        const res = [
            Color.parse(`[b][r][cG]${ Color.align({ text: tran.slate('window-name-stats') }) }[/]`),
            '',
            Color.parse(`[b][cW]${tran.slate('player-name')}:[/] ${player.displayName}`),
            '',
        ];

        for (let i in params) {
            res.push(Color.parse(`[b][u][cG]${ Color.align({ text: tran.slate(`player-${i}`), align: 'left' }) }[/]`));

            const pack = params[i];
            const tmp = [];
            for (let key in pack) {
                if (pack[key].level <= 0 && typeof pack[key].progress != 'undefined' && pack[key].progress <= 0) {
                    continue;
                }

                if (pack[key].hide) {
                    continue;
                }

                const name = tran.slate(`player-${i}-${pack[key].name.toLowerCase()}`);
                const data = pack[key].level.toString();

                let add = statLineLength - name.length - data.length;
                let addStr = new Array(add + 1).join('.');

                tmp.push(Color.parse(`[b][cW]${name}[/]${addStr}[b][cW]${data}[/]`));
            }

            if (tmp.length) {
                res.push(...Color.list(tmp, 2));
            }

            if (i != 'Skills') {
                res.push('');
            }
        }

        const text = `${res.join('\r\n')}`;

        Broadcaster.sendTo({
            to: player,
            text,
        });
    }
};
