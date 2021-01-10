const Broadcaster = require('../../src/engine/broadcaster');
const Color = require('../../src/common/color');

module.exports = {
    name: 'Demo Module',
    enabled: false, // set to true to enable

    init() {

    },

    commands: [
        {
            names: ['test'],
            desc: 'This command if from the module "Demo Module"',
            execute(player) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse('[cY]Congratulations[/], [b][cW]your[/] [cM]module[/] [cG]works![/]'),
                });
            }
        }
    ],
}
