const Broadcaster = require('../../core/engine/broadcaster');
const Color = require('../../core/common/color');

module.exports = {
    commands: [
        {
            names: ['test'],
            desc: 'This command is from the module "custom-commands"',
            execute(player) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse('[cY]Congratulations[/], [b][cW]your[/] [cM]module[/] [cG]works![/]'),
                });
            }
        }
    ],
}
