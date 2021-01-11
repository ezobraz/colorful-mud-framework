const Color = require('../../common/color');
const Dictionary = require('../../dictionary');
const Broadcaster = require('../../engine/broadcaster');

const process = (player, text, collection) => {
    const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const name = params[0];
    params.shift();

    const level = params[0];

    const cls = Dictionary.get(collection, name);
    const param = new cls({
        level,
    });

    player.setParam(collection, param);
    player.save();
    Broadcaster.sendTo({
        to: player,
        text: Color.parse(`[b][cW]${param.type}[/] was set to [cG]${level}[/]`),
    });
}

module.exports = [
    {
        names: ['set attribute'],
        permissions: ['set attributes'],
        examples: [
            'set attribute strength 10'
        ],
        async execute(player, text) {
            process(player, text, 'attributes');
        },
    },
    {
        names: ['set skill'],
        permissions: ['set skills'],
        examples: [
            'set skill strength 10'
        ],
        async execute(player, text) {
            process(player, text, 'skills');
        },
    },
    {
        names: ['set param'],
        permissions: ['set params'],
        examples: [
            'set param health 10'
        ],
        async execute(player, text) {
            process(player, text, 'params');
        },
    },
];
