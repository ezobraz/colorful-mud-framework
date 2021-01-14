const { parse } = require('./color');
const Store = __require('core/store');

const types = {
    'INFO': {
        color: 'cC',
    },
    'ERROR': {
        color: 'cR',
    },
    'WARN': {
        color: 'cy',
    },
    'CHAT': {
        color: 'cB',
    },
    'MOVE': {
        color: 'cY',
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

        let str = parse(`[cW][${h}:${m}][/]`);
        str += parse(`[${types[type].color}] [ ${type} ] -[/]`);
        str += ` ${text}`;

        console.log(str);
    },

    raw(text) {
        console.log(text);
    },

    connected(player) {
        this.log(`New player ${parse(`[b][cg]connected[/]`)}`);

        this.status('Total players', Store.get('players').length);
    },

    disconnected(player, reason = null) {
        let res = `${player.name || 'Unknown Player'} ${parse(`[b][cr]disconnected[/]`)}`;

        if (reason) {
            res += parse(`, [b][cw]${reason}[/]`);
        }

        this.log(res);

        this.status('Total players', Store.get('players').length);
    },

    status(key, value = null, color = 'cg') {
        this.log(`${key}: ${parse(`[b][${color}]${value !== null ? value : 'true'}[/]`)}`);
    },
};
