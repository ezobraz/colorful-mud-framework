const Store = __require('core/store');
const { Color, Broadcaster, Debug } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-say-names'),
            desc: tran.slate('command-say-desc'),
            execute(player, text) {
                if (!text.length) {
                    return;
                }

                if (!player.locationId) {
                    return;
                }

                let location = Store.findById('locations', player.locationId);

                if (!location) {
                    return;
                }

                Debug.log(
                    Color.parse(`${player.displayName} @ [cY]${location.name}[/]: [b]${text}[/]`),
                    'CHAT',
                );

                location.players.forEach(ply => {
                    Broadcaster.replica({
                        to: ply,
                        from: player,
                        text,
                    });
                });

                return true;
            }
        },
        {
            names: tran.slate('command-whisper-names'),
            desc: tran.slate('command-whisper-desc'),
            examples: tran.slate('command-whisper-examples'),
            execute(player, text) {
                if (!text) {
                    return;
                }

                if (!player.locationId) {
                    return;
                }

                const location = Store.findById('locations', player.locationId);

                if (!location) {
                    return;
                }

                const words = text.split(' ');

                if (words.length < 2) {
                    return;
                }

                const name = words[0];

                if (!name) {
                    return;
                }

                words.shift();
                text = words.join(' ');

                if (!text) {
                    return;
                }

                const compareName = name.toLowerCase();
                const players = Store.findAll('players', 'locationId', location._id);
                const to = players.find(ply => ply.name.toLowerCase() == compareName);

                if (!to) {
                    return;
                }

                Debug.log(
                    Color.parse(`[u][b]${player.name}[/] [cM]whispers to[/] [u][b]${to.name}[/] @ [cY]${location.name}[/]: [b]${text}[/]`),
                    'CHAT',
                );

                Broadcaster.sendTo({
                    to,
                    text: Color.parse(`[b][cM]${player.name}: ${text}[/]`),
                });
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse(`[b][cM]You whisper to ${to.name}: ${text}[/]`),
                });

                return true;
            }
        },
    ],
}
