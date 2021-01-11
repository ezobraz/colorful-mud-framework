const Broadcaster = require('../../engine/broadcaster');
const Color = require('../../common/color');
const Dictionary = require('../../dictionary');
const hasPermissions = require('../helpers/has-permissions');

const formatCmdInfo = cmd => {
    let cmdColor = cmd.permissions ? 'cr' : 'cy';
    let name = cmd.names[0];

    name = name[0].toUpperCase() + name.slice(1);

    let tmp = [
        Color.parse(`[b][u][${cmdColor}]${ Color.align({ text: name, align: 'left' }) }[/]`),
    ];

    if (cmd.desc) {
        tmp.push(Color.wrap(cmd.desc));
        tmp.push('');
    }

    if (cmd.names.length > 1) {
        tmp.push(
            Color.parse(`${tran.slate('alias')}: [b][${cmdColor}]${cmd.names.join(', ')}[/]`)
        );
        tmp.push('');
    }

    if (cmd.examples && cmd.examples.length) {
        tmp.push(Color.parse(`${tran.slate('examples')}:`));

        cmd.examples.forEach((ex, i) => {
            const parts = ex.split(' - ');

            if (parts.length >= 2) {
                const exCmd = parts[0];
                parts.shift();
                const exDesc = parts.join(' - ');

                tmp.push(Color.wrap(Color.parse(`${i+1}. [b][${cmdColor}]${exCmd}[/] - ${exDesc}`)));
            } else {
                tmp.push(Color.wrap(Color.parse(`${i+1}. [b][${cmdColor}]${ex}[/]`)));
            }
        });

        tmp.push('');
    }

    return tmp;
}

module.exports = [
    {
        names: tran.slate('command-help-commands-names'),
        desc: tran.slate('command-help-commands-desc'),
        execute(player, text) {
            const commandsList = Dictionary.get('commands');
            const res = [];

            let commands = commandsList;

            commands = commands.sort((a, b) => {
                return !!a.permissions - !!b.permissions;
            });

            for (let i in commands) {
                const cmd = commands[i];

                if (cmd.permissions && !hasPermissions(cmd.permissions, player)) {
                    continue;
                }

                res.push(...formatCmdInfo(cmd));
            }

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },
    {
        names: tran.slate('command-help-command-names'),
        desc: tran.slate('command-help-command-desc'),
        examples: tran.slate('command-help-command-examples'),
        execute(player, text) {
            if (!text) {
                return;
            }

            const commandsList = Dictionary.get('commands');
            const command = commandsList.find(c => c.names.includes(text));

            if (!command) {
                return;
            }

            if (command.permissions && !hasPermissions(command.permissions, player)) {
                return;
            }

            Broadcaster.sendTo({
                to: player,
                text: formatCmdInfo(command).join('\r\n'),
            });
        },
    },
];
