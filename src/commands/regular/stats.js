const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

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
            Color.parse(`[b][u]Social[/]`),
            Color.parse(`[b][cW]Name:[/] [cY]${player.name}[/]`),
            '',
        ];

        for (let i in params) {
            res.push(...[
                Color.parse(`[b][u]${i}[/]`),
            ]);

            const pack = params[i];
            const tmp = [];
            for (let key in pack) {
                const name = key[0].toUpperCase() + key.slice(1);
                const data = pack[key].level.toString();

                let add = 25 - name.length - data.length;
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
        };

        const statsStr = [];
        for (let key in stats) {
            let max = `${key}Max`;
            let name = key.toUpperCase();
            let bg = stats[key].bg;
            let color = stats[key].color;

            let percent = Math.round(player[key] * 100 / player[max]);
            let percentBar = Math.round(percent / 5);
            let percentStr = `${player[key]}/${player[max]}`;

            let str = Color.parse(`[b]${name}[/] `);

            for (let i = 1; i <= 20; i++) {
                let rBg = i <= percentBar ? bg : 'bw';
                let rColor = rBg == 'bw' ? 'cs' : color;

                if (i >= 2 && percentStr.length >= i - 1) {
                    str += Color.parse(`[${rBg}][${rColor}]${percentStr[i - 2]}[/]`);
                    continue;
                }

                str += Color.parse(`[${rBg}] [/]`);
            }

            statsStr.push(str);
        }

        res.push(statsStr.join('     '));

        const text = `${res.join('\r\n')}`;

        Broadcaster.sendTo({
            to: player,
            text,
        });
    }
};
