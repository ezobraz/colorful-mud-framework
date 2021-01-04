const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');

const hasPermissions = require('../common/has-permissions');

const TYPES = {
    'sword': [
        'name',
        'sharpness',
        'length',
        'desc',
    ],
}

const actions = {
    'create': {
        permissions: ['item create'],
        async execute(player, params) {
            const typeStr = params[0];
            params.shift();

            if (!TYPES[typeStr]) {
                return;
            }

            const type = TYPES[typeStr];
            const itemClass = require(`../../entities/${typeStr}`);
            const item = new itemClass();
            const attributes = item.attributes;

            params.forEach((value, i) => {
                attributes[type[i]] = value;
            });

            item.attributes = attributes;

            player.addItem(item);
            player.save();
            Broadcaster.sendTo({
                to: player,
                text: `${item.name} was added to your inventory`,
            });
        },
    },
    'destroy': {
        permissions: ['item destroy'],
        async execute(player, params) {
            const name = params[0];
            const item = player.inventory.find(i => i.name == name);

            if (item) {
                player.removeItem(item);
                player.save();
                Broadcaster.sendTo({
                    to: player,
                    text: `${item.name} was destroyed`,
                });
            }
        },
    },
};

module.exports = {
    names: ['item'],
    permissions: ['item create'],
    desc: 'With this command you can create or destroy items',
    examples: [
        'item create sword Basterd - will create a sword with name "Bastard" in your inventory',
    ],
    async execute(player, text) {
        const params = text.split(' ');
        const actionStr = params[0];
        const action = actions[actionStr];

        params.shift();

        if (!action) {
            return;
        }

        // doesn't have permissions
        if (!hasPermissions(action.permissions, player)) {
            return;
        }

        return action.execute(player, params);
    },
};
