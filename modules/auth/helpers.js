const Broadcaster = require('../../core/engine/broadcaster');
const Color = require('../../core/common/color');
const Debug = require('../../core/engine/debug');
const Config = require('../../core/config');
const Store = require('../../core/store');
const Event = require('../../core/common/event');

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
            text: Color.parse(tran.slate('auth-error-password-same-as-name')),
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
        text: Color.parse(tran.slate('auth-success-signup', { name: player.name} )),
    });

    Debug.status('New player has signed up', player.name);
    player.meta.authStep = 0;
    player.canUseCommands = true;
    Event.emit('playerSignedUp', player);
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
            text: Color.parse(tran.slate('auth-success-signin', { name: player.name} )),
        });

        Debug.status('Player has signed in as', player.name);
        player.meta.authStep = 0;
        player.canUseCommands = true;
        Event.emit('playerSignedIn', player);
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
        text: Color.parse(tran.slate('auth-error-password')),
    });
    Broadcaster.promt({
        to: player,
        text: `${tran.slate('auth-promt-password')}: `,
    });
};

module.exports = {
    checkName,
    signUp,
    signIn,
};
