const { Color, Broadcaster } = __require('core/tools');

const formatCmdInfo = cmd => {
    let cmdColor = cmd.permissions ? 'cr' : 'cy';
    let name = cmd.names[0];

    name = name[0].toUpperCase() + name.slice(1);

    let tmp = [
        Color.parse(`[b][u][${cmdColor}]${ Color.align({ text: name, align: 'left' }) }[/]`),
    ];

    if (cmd.desc) {
        tmp.push(Color.wrap(cmd.desc));
        tmp.push('');
    }

    if (cmd.names.length > 1) {
        tmp.push(
            Color.parse(`${tran.slate('alias')}: [b][${cmdColor}]${cmd.names.join(', ')}[/]`)
        );
        tmp.push('');
    }

    if (cmd.examples && cmd.examples.length) {
        tmp.push(Color.parse(`${tran.slate('examples')}:`));

        cmd.examples.forEach((ex, i) => {
            const parts = ex.split(' - ');

            if (parts.length >= 2) {
                const exCmd = parts[0];
                parts.shift();
                const exDesc = parts.join(' - ');

                tmp.push(Color.wrap(Color.parse(`${i+1}. [b][${cmdColor}]${exCmd}[/] - ${exDesc}`)));
            } else {
                tmp.push(Color.wrap(Color.parse(`${i+1}. [b][${cmdColor}]${ex}[/]`)));
            }
        });

        tmp.push('');
    }

    return tmp;
};

module.exports = {
    formatCmdInfo,
};
