const list = require('./list');
const hasPermissions = require('./common/has-permissions');

module.exports = {
    execute(player, text) {
        const words = text.split(' ');
        const cmd = words[0].toLowerCase();

        const command = list.find(opt => opt.names.includes(cmd));

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

        words.shift();
        return command.execute(player, words.join(' '));
    },
};
