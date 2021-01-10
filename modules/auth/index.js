const Broadcaster = require('../../core/engine/broadcaster');
const Commands = require('../../core/commands');
const Color = require('../../core/common/color');
const Event = require('../../core/common/event');
const Debug = require('../../core/engine/debug');
const Config = require('../../core/config');
const Store = require('../../core/store');

const checkName = async (player, name) => {
    if (name.length > 16) {
        Broadcaster.sendTo({
            to: player,
            text: tran.slate('auth-error-name-long'),
        });
        return;
    }

    player.name = name;

    let exists = await player.exists();

    if (!exists) {
        player.meta.authStep = 2;
        Broadcaster.promt({
            to: player,
            text: `${tran.slate('auth-promt-create-password')}: `,
        });
        return;
    }

    player.meta.authStep = 3;
    Broadcaster.promt({
        to: player,
        text: `${tran.slate('auth-promt-password')}: `,
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
            text: `${tran.slate('auth-promt-create-password')}: `,
        });
        return;
    }

    await player.signUp(password);

    Broadcaster.sendTo({
        to: player,
        text: Color.parse(`[cG]Done.[/] Welcome to the game, ${player.name}`),
    });

    Debug.status('New player has signed up', player.name);
    player.meta.authStep = 0;
    player.canUseCommands = true;
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
        player.meta.authStep = 0;
        player.canUseCommands = true;
        return;
    }

    let attempts = player.meta.passwordAttempt || 0;
    if (attempts >= Config.get('players.auth.maxPasswordAttempts')) {
        player.disconnect('Too many failed attempts');
        return;
    }
    player.meta.passwordAttempt = attempts + 1;

    Broadcaster.sendTo({
        to: player,
        text: Color.parse('[cR]Incorrect.[/] Please, try again'),
    });
    Broadcaster.promt({
        to: player,
        text: `${tran.slate('auth-promt-password')}: `,
    });
};

module.exports = {
    name: 'Auth',

    init() {
        Event.on('playerConnected', player => {
            player.canUseCommands = false;
            player.meta.authStep = 1;
            Broadcaster.promt({
                to: player,
                text: `${tran.slate('auth-promt-your-name')}: `,
            });
        });

        Event.on('playerMessage', ({ player, message }) => {
            if (!player.meta.authStep) {
                return;
            }

            switch(player.meta.authStep) {
                // receive login and check if user exists in db
                case 1:
                    checkName(player, message);
                    break;

                // ask for a password (sign up)
                case 2:
                    signUp(player, message);
                    break;

                // ask for a password (sign in)
                case 3:
                    signIn(player, message);
                    break;
                default:
                    break;
            }
        });
    },
};
