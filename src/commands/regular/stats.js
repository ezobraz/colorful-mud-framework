const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Config = require('../../config');

const lineLength = Config.get('format.lineLength');
const statLineLength = lineLength / 2 - 1;

module.exports = {
    names: ['stats', 'level', 'score', 'status'],
    desc: 'Shows your current stats',
    examples: [
        'stats',
    ],
    execute(player) {
        const params = {
            'Attributes': player.attributes,
            'Skills': player.skills,
        };

        const res = [
            Color.parse(`[b][r][cG]${ Color.align({ text: 'Stats' }) }[/]`),
            '',
            Color.parse(`[b][cW]Name:[/] ${player.displayName}`),
            '',
        ];

        for (let i in params) {
            res.push(Color.parse(`[b][u][cG]${ Color.align({ text: i, align: 'left' }) }[/]`));

            const pack = params[i];
            const tmp = [];
            for (let key in pack) {
                if (pack[key].level <= 0 && pack[key].progress <= 0) {
                    continue;
                }

                const name = key[0].toUpperCase() + key.slice(1);
                const data = pack[key].level.toString();

                let add = statLineLength - name.length - data.length;
                let addStr = new Array(add + 1).join('.');

                tmp.push(Color.parse(`[b][cW]${name}[/]${addStr}[b][cW]${data}[/]`));
            }

            res.push(...Color.list(tmp, 2));
            res.push('');
        }

        const stats = {
            hp: {
                bg: 'br',
                color: 'cW',
            },
            ed: {
                bg: 'bg',
                color: 'cS',
            },
            mp: {
                bg: 'bb',
                color: 'cW',
            },
        };

        const statsStr = [];
        for (let key in stats) {
            let max = `${key}Max`;

            if (player[max] <= 0) {
                continue;
            }

            let str = Color.parse(`[b]${key.toUpperCase()}[/] `) + Color.progress({
                bgColor: stats[key].bg,
                textColor: stats[key].color,
                val: player[key],
                max: player[max],
            });

            statsStr.push(str);
        }

        res.push(statsStr.join(' '));


        const text = `${res.join('\r\n')}`;

        Broadcaster.sendTo({
            to: player,
            text,
        });
    }
};
