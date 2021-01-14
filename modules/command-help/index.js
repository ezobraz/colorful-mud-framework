const Dictionary = __require('core/dictionary');
const hasPermissions = __require('core/commands/helpers/has-permissions');
const { Color, Broadcaster } = __require('core/tools');
const { formatCmdInfo } = require('./helpers');

module.exports = {
    commands: [
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

    ],
}
