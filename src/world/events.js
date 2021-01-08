const Event = require('../common/event');
const Config = require('../config');
const Debug = require('../engine/debug');
const Store = require('../store');
const Processor = require('../processor');
const Commands = require('../commands');

const Player = require('../entities/actors/player');

const requireChatCommand = Config.get('chat.requireCommand');

const subscribers = {
    'save':(params = 'all') => {
        if (['all', 'players'].includes(params)) {
            const players = Store.get('players');
            players.forEach(ply => ply.save());
            Debug.status('Saved', 'players');
        }

        if (['all', 'locations'].includes(params)) {
            const locations = Store.get('locations');
            locations.forEach(loc => loc.save());
            Debug.status('Saved', 'locations');
        }
    },

    'playerConnected': ({socket}) => {
        const player = new Player({
            socket,
        });

        player.state = {
            name: 'auth',
            step: 0,
        };

        Store.add('players', player);
        Processor.auth(player);
        Debug.connected(player);

        player.socket.on('data', data => {
            const message = new Buffer.from(data).toString().trim();

            if (!message || message.length >= 1024) {
                return;
            }

            player.lastInput = Date.now();

            if (Commands.execute(player, message)) {
                return;
            }

            if (player.state.step === -1) {
                return;
            }

            if (player.state.name && typeof Processor[player.state.name] != 'undefined') {
                Processor[player.state.name](player, message);
            }

            if (!requireChatCommand) {
                Commands.execute(player, `say ${message}`);
            }
        });

        player.socket.on('error', e => {
            console.error(e);
            player.disconnect();
        });

        player.socket.on('end', () => {
            player.disconnect();
        });
    },
}

module.exports = {
    init() {
        for (let i in subscribers) {
            Event.on(i, subscribers[i]);
        }

        Debug.status('Events initialized', Object.keys(subscribers).length);
    }
}
