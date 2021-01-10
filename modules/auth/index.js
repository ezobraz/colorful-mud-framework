const Broadcaster = require('../../core/engine/broadcaster');
const Event = require('../../core/common/event');
const { checkName, signUp, signIn } = require('./helpers');

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
