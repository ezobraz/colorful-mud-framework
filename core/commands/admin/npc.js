const { Color, Broadcaster } = __require('core/tools');
const Store = __require('core/store');
const Dictionary = __require('core/dictionary');

module.exports = [
    // list types
    {
        names: tran.slate('command-list-actor-types-names'),
        desc: tran.slate('command-list-actor-types-desc'),
        permissions: ['list actor types'],
        async execute(player) {
            const actorTypes = Dictionary.get('actors');

            let res = [];

            for (let i in actorTypes) {
                if (i === 'player') {
                    continue;
                }

                const actorClass = new actorTypes[i];

                // const params = actorClass.setters.map(key => `${key}: ${actorClass[key]}`);

                res.push(
                    Color.parse(`[b][cY][r] ${actorClass.class} [/]`),
                    // ...params,
                    '',
                );
            }

            Broadcaster.sendTo({
                to: player,
                text: res.join('\r\n'),
            });
        },
    },

    // create
    {
        names: tran.slate('command-create-actor-names'),
        desc: tran.slate('command-create-actor-desc'),
        examples: tran.slate('command-create-actor-examples'),
        permissions: ['create actors'],
        async execute(player, text) {
            if (!player.locationId) {
                return;
            }

            const location = Store.findById('locations', player.locationId);
            if (!location) {
                return;
            }

            const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const type = params[0];
            params.shift();

            if (type == 'player') {
                return;
            }

            const actorClass = Dictionary.get('actors', type);

            if (!actorClass) {
                return;
            }

            const actor = new actorClass({
                name: params[0],
            });

            location.addNpc(actor);
            location.save();
        },
    },
];
