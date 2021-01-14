module.exports = {
    /**
     * Whenever called, server will save everything
     *
     * @event SAVE
     */
    'SAVE': true,

    /**
     * Fired when server and all it's components are fully initialized
     *
     * @event SERVER_READY
     */
    'SERVER_READY': true,

    /**
     * Fired when new socket (player) just connected to server
     *
     * @event SOCKET_CONNECTED
     */
    'SOCKET_CONNECTED': true,

    /**
     * Fired when new player object has been created (called right after SOCKET_CONNECTED)
     *
     * @event PLAYER_CONNECTED
     * @param {Object} { Player: player, string: message }
     */
    'PLAYER_CONNECTED': true,

    /**
     * Fired when new player sends message to server
     *
     * @event PLAYER_MESSAGE
     * @param {Object} { Player: player, string: message }
     */
    'PLAYER_MESSAGE': true,
}
