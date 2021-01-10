const Broadcaster = require('../../core/engine/broadcaster');
const Color = require('../../core/common/color');
const Event = require('../../core/common/event');
const pjson = require('../../package.json');

const img = [
    '                  YYWW                   WWCC                 ',
    '                  YYWW                   WWCC                 ',
    '                  WWYY      W W W W      CCWW                 ',
    '                  WWYY      WWWWWWW      CCWW                 ',
    '                  R         WWW WWW         R                 ',
    '                  R         WWWWWWW         R                 ',
    '                  R      W WRWRWRWRW W      R                 ',
    '               W WRW W W WWWWWWWWWWWWW W W WRW W              ',
    '               WWWWWWWWWWWW WWRRRWW WWWWWWWWWWWW              ',
    '               WWWWWWWWWWWWWWWRRRWWWWWWWWWWWWWWW              ',
];

const motd = [
    '',
    Color.img(img),
    '',
    Color.align({ text: `v${pjson.version}`, align: 'right' }),
    '',
];

module.exports = {
    name: 'MOTD',

    init() {
        Event.on('playerConnected', player => Broadcaster.sendTo({
            to: player,
            text: motd.join('\r\n'),
        }));
    },
}
