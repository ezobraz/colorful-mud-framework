const Broadcaster = require('../engine/broadcaster');
const Npc = require('../entities/npc');
const Commands = require('../commands');
const Color = require('../common/color');
const Event = require('../common/event');
const Debug = require('../engine/debug');
const Config = require('../config');
const Store = require('../store');

const img = [
    '     YYSS                   SSCC',
    '     YYSS                   SSCC',
    '     SSYY      W W W W      CCSS',
    '     SSYY      WWWWWWW      CCSS',
    '     R         WWW WWW         R',
    '     R         WWWWWWW         R',
    '     R      W WRWRWRWRW W      R',
    '  W WRW W W WWWWWWWWWWWWW W W WRW W',
    '  WWWWWWWWWWWW WWRRRWW WWWWWWWWWWWW',
    '  WWWWWWWWWWWWWWWRRRWWWWWWWWWWWWWWW',
];

const askForLogin = player => {
    player.state = { step: 1 };

    let res = [
        '',
        '',
        Color.img(img),
        '',
        Color.parse('[b][r][cY] Welcome [/] to another [b][r][cW] MUD [/]'),
        '',
        'By what name are you known in this world?',
    ];

    Broadcaster.sendTo({
        to: player,
        text: res.join('\r\n'),
    });

    Broadcaster.promt({
        to: player,
        text: `Your name: `,
    });
};

const checkName = async (player, name) => {
    if (name.length > 16) {
        Broadcaster.sendTo({
            to: player,
            text: 'Too long, try to shrink it to 16 symbols, please.',
        });
        return;
    }

    player.state = { step: -1 };
    player.name = name;

    let exists = await player.exists();

    if (!exists) {
        player.state = { step: 2 };

        Broadcaster.sendTo({
            to: player,
            text: `Very well, ${name}. What  will be your password?`,
        });
        Broadcaster.promt({
            to: player,
            text: `Create a password: `,
        });
        return;
    }

    player.state = { step: 3 };

    Broadcaster.promt({
        to: player,
        text: `Password: `,
    });
};

const signUp = async (player, password) => {
    if (password == player.name) {
        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`[cR]Not a valid password.[/] Your name can not be your password. Try again`),
        });
        Broadcaster.promt({
            to: player,
            text: `Create a password: `,
        });
        return;
    }

    await player.signUp(password);

    Broadcaster.sendTo({
        to: player,
        text: Color.parse(`[cG]Done.[/] Welcome to the game, ${player.name}`),
    });

    Debug.status('New player has signed up', player.name);

    player.state = { name: null, step: 0 };
};

const signIn = async (player, password) => {
    let res = await player.auth(password);

    if (res) {
        // kick mults
        const mults = Store.findAllById('players', res._id);
        const silent = mults && mults.length;
        if (silent) {
            mults.forEach(ply => {
                ply.disconnect('switch connections', true);
            });
        }

        player.setUp({ params: res, silent });

        Broadcaster.sendTo({
            to: player,
            text: Color.parse(`[cG]Correct.[/] Welcome back, ${player.name}`),
        });

        Debug.status('Player has signed in as', player.name);

        player.state = { name: null, step: 0 };
        return;
    }

    let attempts = player.meta['passwordAttempt'] || 0;
    if (attempts >= Config.get('players.auth.maxPasswordAttempts')) {
        player.disconnect('Too many failed attempts');
        return;
    }
    player.meta['passwordAttempt'] = attempts + 1;

    Broadcaster.sendTo({
        to: player,
        text: Color.parse('[cR]Incorrect.[/] Please, try again'),
    });
    Broadcaster.promt({
        to: player,
        text: `Password: `,
    });
};

module.exports = async (player, text) => {
    switch(player.state.step) {
        // ask for login
        case 0:
            askForLogin(player);
            break;

        // receive login and check if user exists in db
        case 1:
            checkName(player, text);
            break;

        // ask for a password (sign up)
        case 2:
            signUp(player, text);
            break;

        // ask for a password (sign in)
        case 3:
            signIn(player, text);
            break;
    }
};
