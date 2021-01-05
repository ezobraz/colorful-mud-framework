const net = require('net');
const Event = require('../common/event');
const Debug = require('../engine/debug');

let server;

const initServer = () => {
    server = net.createServer(socket => {
        Event.emit('playerConnected', {socket});
    });

    server.on('error', e => {
        Event.emit('save');
        // this.server.close();
    });

    server.on('close', () => {
        Event.emit('save');
    });

    server.listen(4000);
}

module.exports = {
    async init() {
        initServer();
        Debug.status('Server initialized');
    }
};
