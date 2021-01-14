module.exports = {
    commands: [
        {
            names: tran.slate('command-quit-names'),
            desc: tran.slate('command-quit-desc'),
            execute(player, text) {
                player.disconnect();
                return true;
            }
        }
    ],
}
