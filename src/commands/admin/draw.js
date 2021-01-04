const Color = require('../../common/color');
const Broadcaster = require('../../engine/broadcaster');
const Store = require('../../store');

const replacePixel = (player, data) => {
    if (!player.meta.draw || !player.meta.draw.length) {
        player.meta.draw = [];
    }

    let parts = data.split(' ');

    if (parts.length < 3) {
        return;
    }

    let line = parts[0];
    let row = parts[1];
    let symbol = parts[2];

    symbol = symbol.toUpperCase();
    symbol = symbol.replace('_', ' ');

    if (line < 0) {
        let count = line * -1;
        for (let i = 1; i <= count; i++) {
            player.meta.draw.unshift('');
        }
        line = 0;
    }

    if (!player.meta.draw[line]) {
        player.meta.draw[line] = '';
    }

    let drawLine = player.meta.draw[line];

    drawLine = drawLine.split('');
    if (!drawLine[row]) {
        for (let i = drawLine.length; i < row; i++) {
            drawLine[i] = ' ';
        }
    }
    drawLine[row] = symbol;
    drawLine = drawLine.join('');

    player.meta.draw[line] = drawLine;

    Broadcaster.sendTo({
        to: player,
        text: Color.img(player.meta.draw, true),
    });

    return true;
};

module.exports = {
    names: ['draw', 'dr'],
    permissions: ['draw'],
    desc: 'With this command you can draw pictures',
    examples: [
        "draw upload - will upload current location's picture tou your canvas",
        "draw set 0 5 r - will replace pixel at row 0, column 5 to Red color",
        "draw show - will output your canvas",
    ],

    async execute(player, text) {
        const words = text.split(' ');
        const actionStr = words[0];
        const action = this.actions[actionStr];

        words.shift();

        if (!action) {
            return;
        }

        return action.execute(player, words.join(' '));
    },

    actions: {
        'set': {
            async execute(player, data) {
                if (!data) {
                    return;
                }

                let parts = data.split(' ');

                if (parts.length < 2) {
                    return;
                }

                if (parts.length == 3) {
                    return replacePixel(player, data);
                }

                let line = parts[0];
                let pixels = parts[1];

                player.meta.draw = player.meta.draw || [];

                if (pixels == 'null') {
                    player.meta.draw.splice(line, 1);

                    Broadcaster.sendTo({
                        to: player,
                        text: Color.img(player.meta.draw, true),
                    });
                    return;
                }

                pixels = pixels.replace(/_/g, ' ');
                pixels = pixels.toUpperCase();

                if (line < 0) {
                    let count = line * -1;
                    for (let i = 1; i <= count; i++) {
                        player.meta.draw.unshift('');
                    }
                    line = 0;
                }

                player.meta.draw[line] = pixels;

                Broadcaster.sendTo({
                    to: player,
                    text: Color.img(player.meta.draw, true),
                });
            },
        },
        'show': {
            execute(player) {
                let img = player.meta.draw;

                if (!img || !img.length) {
                    return;
                }

                Broadcaster.sendTo({
                    to: player,
                    text: Color.img(img, true),
                });
            },
        },
        // upload image from current location
        'upload': {
            execute(player) {
                const playerLocationId = player.locationId;

                if (!playerLocationId) {
                    return;
                }

                const location = Store.findById('locations', playerLocationId);

                if (!location) {
                    return;
                }

                player.meta.draw = JSON.parse(JSON.stringify(location.img));
                Broadcaster.sendTo({
                    to: player,
                    text: Color.img(player.meta.draw, true),
                });
                return true;
            },
        },
    },
};
