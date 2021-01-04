module.exports = {
    names: ['quit', 'exit'],
    desc: 'Disconnects you from the game and saves your account',
    examples: [
        'quit',
    ],
    execute(player, text) {
        player.disconnect();
        return true;
    }
};
