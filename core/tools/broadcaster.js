const { parse, wrap } = require('./color');

module.exports = {
    sendTo({ to, text, wrap = false }) {
        if (wrap) {
            text = wrap(text);
        }

        to.socket.write(`${text}\r\n\r\n`);
    },

    promt({ to, text }) {
        to.socket.write(text);
    },

    replica({ from, to, text }) {
        text = parse(`${from.displayName}: [b]${text}[/]`);
        text = wrap(text);

        this.sendTo({ to, text });
    },
};
