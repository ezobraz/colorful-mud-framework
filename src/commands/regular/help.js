const Broadcaster = require('../../engine/broadcaster');
const hasPermissions = require('../common/has-permissions');
const Color = require('../../common/color');

const actions = [
    {
        names: ['main'],
        execute(player) {
            let res = [
                'main',
                '',
            ];

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },
    {
        names: ['command', 'commands'],
        execute(player, text = null) {
            const commandsList = require('../list');
            const res = [];

            let commands = text ? commandsList.filter(c => c.names.includes(text)) : commandsList;

            commands = commands.sort((a, b) => {
                return !!a.permissions - !!b.permissions;
            });

            for (let i in commands) {
                const cmd = commands[i];

                if (cmd.permissions && !hasPermissions(cmd.permissions, player)) {
                    continue;
                }

                let cmdColor = cmd.permissions ? 'cr' : 'cy';
                let name = text ? text : cmd.names[0];

                name = name[0].toUpperCase() + name.slice(1);

                let tmp = [
                    Color.parse(`[b][${cmdColor}]${name}[/]`),
                    Color.parse(`[b][${cmdColor}]------------------------------------------------------[/]`),
                ];

                if (cmd.desc) {
                    tmp.push(Color.wrap(cmd.desc));
                    tmp.push('');
                }

                if (cmd.names.length > 1) {
                    tmp.push(
                        Color.parse(`Alias: [b][${cmdColor}]${cmd.names.join(', ')}[/]`)
                    );
                    tmp.push('');
                }

                if (cmd.examples && cmd.examples.length) {
                    tmp.push(Color.parse(`Examples:`));

                    cmd.examples.forEach((ex, i) => {
                        const parts = ex.split(' - ');

                        if (parts.length >= 2) {
                            const exCmd = parts[0];
                            parts.shift();
                            const exDesc = parts.join(' - ');

                            tmp.push(Color.parse(`${i+1}. [b][${cmdColor}]${exCmd}[/] - ${exDesc}`));
                        } else {
                            tmp.push(Color.parse(`${i+1}. [b][${cmdColor}]${ex}[/]`));
                        }
                    });

                    tmp.push('');
                }

                if (parseInt(i) + 1 < commands.length) {
                    tmp.push('');
                }
                res.push(...tmp);
            }

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        }
    },
];

module.exports = {
    names: ['help'],
    desc: 'Shows info for the specified command. If no argument passed, will output the list of all available commands',
    examples: [
        'help commmands',
        'help command look',
        'help command score',
    ],
    execute(player, text) {
        if (!text) {
            return actions[0].execute(player);
        }

        const words = text.split(' ');
        const actionStr = words[0];

        const action = actions.find(a => a.names.includes(actionStr));

        if (!action) {
            return;
        }

        words.shift();
        action.execute(player, words.join(' '));
    },
}
