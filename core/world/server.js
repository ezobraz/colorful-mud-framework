const net = require('net');
const Event = require('../common/event');
const Debug = require('../engine/debug');

let server;

module.exports = {
    async init() {
        server = net.createServer(socket => {
            Event.emit('socketConnected', socket);
        });

        server.on('error', e => {
            Event.emit('save');
            // this.server.close();
        });

        server.on('close', () => {
            Event.emit('save');
        });

        server.listen(4000);
        Debug.status('Server initialized');
    }
};
