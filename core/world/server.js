const net = require('net');
const Event = __require('core/event');
const { Debug } = __require('core/tools');

let server;

module.exports = {
    async init() {
        server = net.createServer(socket => {
            Event.emit('SOCKET_CONNECTED', socket);
        });

        server.on('error', e => {
            console.log(e);
            server.close();
        });

        server.on('close', () => {
            Event.emit('SAVE');
        });

        server.listen(4000);
        Debug.status('Server', 'loaded');
    }
};
