const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Config = require('../../config');

const lineLength = Config.get('format.lineLength');
const statLineLength = lineLength / 2 - 1;

module.exports = {
    names: tran.slate('command-hp-names'),
    desc: tran.slate('command-hp-desc'),
    execute(player) {
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

        Broadcaster.sendTo({
            to: player,
            text: statsStr.join(' '),
        });
    }
};
