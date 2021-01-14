const { Color, Broadcaster } = __require('core/tools');

module.exports = {
    commands: [
        {
            names: tran.slate('command-hp-names'),
            desc: tran.slate('command-hp-desc'),
            execute(player) {
                const statsStr = player.params.map(param => {
                    return Color.parse(`[b]${param.shortName}[/] `) + Color.progress({
                        bgColor: param.bgColor,
                        textColor: param.textColor,
                        val: param.level,
                        max: param.max(player),
                    });
                });

                Broadcaster.sendTo({
                    to: player,
                    text: statsStr.join(' '),
                });
            }
        }
    ],
}
