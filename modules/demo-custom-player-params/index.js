const Broadcaster = require('../../core/engine/broadcaster');
const Color = require('../../core/common/color');
const Store = require('../../core/store');

module.exports = {
    name: 'Demo: Custom Player Params',

    init() {
        Store.add('params', require('./params/mana'), 'mana');
    },

    commands: [
        {
            names: ['test'],
            desc: 'This command if from the module "Demo" module',
            execute(player) {
                Broadcaster.sendTo({
                    to: player,
                    text: Color.parse('[cY]Congratulations[/], [b][cW]your[/] [cM]module[/] [cG]works![/]'),
                });
            }
        }
    ],
}
