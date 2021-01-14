const { Color, Broadcaster } = __require('core/tools');
const Dictionary = __require('core/dictionary');

const process = (player, text, collection) => {
    const params = text.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const className = params[0].toLowerCase();
    params.shift();

    const level = parseInt(params[0]);

    let param = player[collection].find(el => el.class.toLowerCase() == className);

    if (param) {
        param.level = level;
    } else {
        const cls = Dictionary.get(collection, className);
        param = new cls({
            level,
        });
        player[collection].push(param);
    }

    player.save();
    Broadcaster.sendTo({
        to: player,
        text: Color.parse(`[b][cW]${param.class}[/] was set to [cG]${level}[/]`),
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
