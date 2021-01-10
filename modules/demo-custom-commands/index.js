const Broadcaster = require('../../core/engine/broadcaster');
const Color = require('../../core/common/color');

module.exports = {
    name: 'Demo: Custom Commands',

    init() {

    },

    commands: [
        {
            names: ['test'],
            desc: 'This command if from the module "demo-custom-commands" module',
            execute(player) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse('[cY]Congratulations[/], [b][cW]your[/] [cM]module[/] [cG]works![/]'),
                });
            }
        }
    ],
}
