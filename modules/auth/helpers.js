const { Color, Debug, Broadcaster } = __require('core/tools');
const Config = __require('core/config');
const Store = __require('core/store');
const Event = __require('core/event');

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
        player.tmp.authStep = 2;
        Broadcaster.promt({
            to: player,
            text: `${tran.slate('auth-promt-create-password')}: `,
        });
        return;
    }

    player.tmp.authStep = 3;
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
    player.tmp.authStep = 0;
    player.canUseCommands = true;
    Event.emit('PLAYER_SIGNED_UP', player);
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

        const startLocationId = await Config.getRuntime('startLocationId');

        player.locationId = player.locationId || startLocationId;

        player.setUp({ params: res, silent });

        Broadcaster.sendTo({
            to: player,
            text: Color.parse(tran.slate('auth-success-signin', { name: player.name} )),
        });

        Debug.status('Player has signed in as', player.name);
        player.tmp.authStep = 0;
        player.canUseCommands = true;
        Event.emit('PLAYER_SIGNED_IN', player);
        return;
    }

    let attempts = player.tmp.passwordAttempt || 0;
    if (attempts >= 5) {
        player.disconnect('Too many failed attempts');
        return;
    }
    player.tmp.passwordAttempt = attempts + 1;

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
