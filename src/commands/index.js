const list = require('./list');
const hasPermissions = require('./helpers/has-permissions');

module.exports = {
    execute(player, text) {
        let cmdParams = '';
        const command = list().find(opt => {
            return opt.names.find(name => {
                if (text == name) {
                    return true;
                }

                if (text.startsWith(`${name} `)) {
                    cmdParams = text.replace(`${name} `, '');
                    return true;
                }

                return false
            });
        });

        if (!command) {
            return false;
        }

        if (command.pemissions && !hasPermissions(command.permissions, player)) {
            return false;
        }

        if (player.state.name == 'auth' && !command.names.includes('quit')) {
            return false;
        }

        if (player.state.step === -1 && !command.names.includes('quit')) {
            return false;
        }

        return command.execute(player, cmdParams);
    },
};
