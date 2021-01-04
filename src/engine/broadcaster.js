const Color = require('../common/color');

module.exports = {
    sendTo({ to, text, wrap = false }) {
        if (wrap) {
            text = Color.wrap(text);
        }

        to.socket.write(`${text}\r\n\r\n`);
    },

    promt({ to, text }) {
        to.socket.write(text);
    },

    replica({ from, to, text }) {
        text = Color.parse(`[b][cR]${from.name}[/]: ${text}`);
        text = Color.wrap(text);

        this.sendTo({ to, text });
    },

    system({ to, text }) {
        text = Color.parse(`[cy]${text}[/]`);
        text = Color.wrap(text);
        this.sendTo({ to, text });
    },
};
