const Event = require('../common/event');
const Config = require('../config');
const Debug = require('../engine/debug');
const Store = require('../store');
const Commands = require('../commands');
const Dictionary = require('../dictionary');

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

    'socketConnected': socket => {
        const Player = Dictionary.get('actors', 'player');
        const player = new Player({
            socket,
        });

        Store.add('players', player);
        Event.emit('playerConnected', player);

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

            Event.emit('playerMessage', { player, message });

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
