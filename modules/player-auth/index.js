const { Broadcaster } = __require('core/tools');
const Event = __require('core/event');
const { checkName, signUp, signIn } = require('./helpers');

module.exports = {
    events: {
        /**
         * Fired when player has signed in
         *
         * @event PLAYER_SIGNED_IN
         * @param {Object} Player
         */
        'PLAYER_SIGNED_IN': true,

        /**
         * Fired when new player has signed up
         *
         * @event PLAYER_SIGNED_UP
         * @param {Object} Player
         */
        'PLAYER_SIGNED_UP': true,
    },

    init() {
        Event.on('PLAYER_CONNECTED', player => {
            player.canUseCommands = false;
            player.tmp.authStep = 1;
            Broadcaster.promt({
                to: player,
                text: `${tran.slate('auth-promt-your-name')}: `,
            });
        });

        Event.on('PLAYER_MESSAGE', ({ player, message }) => {
            if (!player.tmp.authStep) {
                return;
            }

            switch(player.tmp.authStep) {
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
