const Broadcaster = require('../../src/engine/broadcaster');
const Color = require('../../src/common/color');

module.exports = {
    name: 'Demo Module',
    enabled: true,

    init() {

    },

    commands: [
        {
            names: ['test'],
            execute(player) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse('[cY]Congratulations[/], [b][cW]your[/] [cM]module[/] [cG]works![/]'),
                });
            }
        }
    ],
}