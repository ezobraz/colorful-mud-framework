const Color = require('../common/color');
const Store = require('../store');

let lastRam = 0;

const types = {
    'INFO': {
        color: 'cC',
    },
    'ERROR': {
        color: 'cR',
    },
    'CHAT': {
        color: 'cB',
    },
}

module.exports = {
    log(text, type = 'INFO') {
        let dt = new Date();
        let h = dt.getHours();
        let m = dt.getMinutes();

        if (h < 10) {
            h = `0${h}`;
        }

        if (m < 10) {
            m = `0${m}`;
        }

        let str = Color.parse(`[cW][${h}:${m}][/]`);
        str += Color.parse(`[${types[type].color}] [ ${type} ] -[/]`);
        str += ` ${text}`;

        console.log(str);
    },

    connected(player) {
        this.log(`New player ${Color.parse(`[b][cg]connected[/]`)}`);

        this.status('Total players', Store.get('players').length);
    },

    disconnected(player, reason = null) {
        let res = `${player.name || 'Unknown Player'} ${Color.parse(`[b][cr]disconnected[/]`)}`;

        if (reason) {
            res += Color.parse(`, [b][cw]${reason}[/]`);
        }

        this.log(res);

        this.status('Total players', Store.get('players').length);
    },

    status(key, value = null, color = 'cg') {
        this.log(`${key}: ${Color.parse(`[b][${color}]${value !== null ? value : 'true'}[/]`)}`);
    },

    memory() {
        let usedMb = process.memoryUsage().heapUsed / 1024 / 1024;
        let used = Math.round(usedMb * 100) / 100;

        if (used === lastRam) {
            return;
        }

        lastRam = used;

        this.status('Ram usage', `${used} mb`);
    },
};
