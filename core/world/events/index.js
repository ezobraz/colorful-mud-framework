const Event = __require('core/event');
const Config = __require('core/config');
const Store = __require('core/store');
const Commands = __require('core/commands');
const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');
const list = require('./list');

const requireChatCommand = Config.get('chat.requireCommand');

const listeners = {
    'SAVE':(params = 'all') => {
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

    'SOCKET_CONNECTED': socket => {
        const Player = Dictionary.get('actors', 'player');
        const player = new Player({
            socket,
        });

        Store.add('players', player);
        Event.emit('PLAYER_CONNECTED', player);

        Debug.connected(player);

        let data = '';
        player.socket.on('data', d => {
            data += d;
            let p = data.indexOf('\n');
            if(~p) {
                let cmd = data.substr(0, p);
                data = data.slice(p + 1);

                const message = cmd.trim();

                if (!message || message.length >= 1024) {
                    return;
                }

                player.lastInput = Date.now();

                if (Commands.execute(player, message)) {
                    return;
                }

                Event.emit('PLAYER_MESSAGE', { player, message });

                if (!requireChatCommand) {
                    Commands.execute(player, `say ${message}`);
                }
            }
        });

        // player.socket.on('data', data => {
        //     const message = new Buffer.from(data).toString().trim();

        //     if (!message || message.length >= 1024) {
        //         return;
        //     }

        //     player.lastInput = Date.now();

        //     if (Commands.execute(player, message)) {
        //         return;
        //     }

        //     Event.emit('PLAYER_MESSAGE', { player, message });

        //     if (!requireChatCommand) {
        //         Commands.execute(player, `say ${message}`);
        //     }
        // });

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
        Dictionary.append('events', list);
        Debug.status(`${Object.keys(Dictionary.get('events')).length} Event Types`, 'loaded');

        for (let i in listeners) {
            Event.on(i, listeners[i]);
        }

        Debug.status(`${Object.keys(listeners).length} Event listeners`, 'loaded');
    }
}
