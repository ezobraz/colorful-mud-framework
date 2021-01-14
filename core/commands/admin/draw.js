const { Color, Broadcaster } = __require('core/tools');
const Store = __require('core/store');

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

module.exports = [
    {
        names: ['set pixel'],
        permissions: ['draw'],
        desc: 'Draws pixel in grid to specified color',
        examples: [
            'set pixel 0 5 r - set pixel at row 0, column 5 to Red color',
        ],
        async execute(player, text) {
            if (!text) {
                return;
            }

            let parts = text.split(' ');

            if (parts.length < 2) {
                return;
            }

            if (parts.length == 3) {
                return replacePixel(player, text);
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
    {
        names: ['show canvas'],
        permissions: ['draw'],
        desc: 'Shows your canvas to you (only visible to you)',
        examples: [
            'show canvas',
        ],
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
    {
        names: ['upload canvas'],
        permissions: ['draw'],
        desc: "Uploads current location's picture tou your canvas so you can make some changes",
        examples: [
            'upload canvas',
        ],
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
];
