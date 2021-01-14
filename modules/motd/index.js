const { Color, Broadcaster } = __require('core/tools');
const Event = __require('core/event');
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
    init() {
        Event.on('PLAYER_CONNECTED', player => Broadcaster.sendTo({
            to: player,
            text: motd.join('\r\n'),
        }));
    },
}
