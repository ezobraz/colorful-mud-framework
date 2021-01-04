module.exports = {
    auth(player, message = null) {
        require('./auth')(player, message);
    },

    battle(player, message = null) {
        // todo
    },
}
