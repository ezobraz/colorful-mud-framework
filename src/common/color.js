const alias = {
    // normal
    'cs': '[30m', // black
    'cr': '[31m', // red
    'cg': '[32m', // green
    'cy': '[33m', // yellow
    'cb': '[34m', // blue
    'cm': '[35m', // magenta
    'cc': '[36m', // cyan
    'cw': '[37m', // white,

    // bright
    'cS': '[30m', // bright black
    'cR': '[31m', // bright red
    'cG': '[32m', // bright green
    'cY': '[33m', // bright yellow
    'cB': '[34m', // bright blue
    'cM': '[35m', // bright magenta
    'cC': '[36m', // bright cyan
    'cW': '[37m', // bright white,

    // background normal
    'bs': '[40m', // black
    'br': '[41m', // red
    'bg': '[42m', // green
    'by': '[43m', // yellow
    'bb': '[44m', // blue
    'bm': '[45m', // magenta
    'bc': '[46m', // cyan
    'bw': '[47m', // white,

    // background bright
    'bS': '[40m;1m', // bright black
    'bR': '[41m;1m', // bright red
    'bG': '[42m;1m', // bright green
    'bY': '[43m;1m', // bright yellow
    'bB': '[44m;1m', // bright blue
    'bM': '[45m;1m', // bright magenta
    'bC': '[46m;1m', // bright cyan
    'bW': '[47m;1m', // bright white,

    // styles
    'b': '[1m',
    'u': '[4m',
    'r': '[7m',

    // reset
    '/': '[0m',
};

const imgSymbols = {
    'S': alias['bs'], // black
    'R': alias['br'], // red
    'G': alias['bg'], // green
    'Y': alias['by'], // yellow
    'B': alias['bb'], // blue
    'M': alias['bm'], // magenta
    'C': alias['bc'], // cyan
    'W': alias['bw'], // white,
};

const parse = text => {
    for (let symbol in alias) {
        text = text.replace(new RegExp(`\\[${symbol}\\]`, 'g'), '\u001b' + alias[symbol]);
    }

    return text;
};

const formatScaleNumber = i => {
    const scaleColor = [
        'W',
        'G',
        'B',
        'C',
        'Y',
        'M',
        'R',
    ];

    let number = i;
    let color = scaleColor[Math.floor(Math.ceil(number) / 10)];

    if (number / 10 >= 1) {
        number = number - number + number % 10;
    }

    return parse(`[r][c${color}]${number}[/]`);
};

const wrap = text => {
    const res = text.split(' ');
    const chunks = [];
    let lastChunk = 0;

    res.forEach((word, i) => {
        if (word) {
            if (!chunks[lastChunk]) {
                chunks[lastChunk] = [];
            }

            chunks[lastChunk].push(word);
        }

        const line = chunks[lastChunk].join(' ');

        if (i + 1 == res.length || line.length >= 50) {
            chunks[lastChunk] = line;
            lastChunk += 1;
        }
    });

    return chunks.join('\r\n');
};

const list = (arr, cols = 1) => {
    let res = [
        [],
    ];

    cellLength = arr.sort((a, b) => b.length - a.length)[0].length;

    let lastCol = 0;

    arr.forEach(item => {
        if (res[lastCol].length >= cols) {
            lastCol++;
            res[lastCol] = [];
        }

        let add = cellLength - item.length;
        let addStr = new Array(add + 1).join(' ');

        res[lastCol].push(`${item}${addStr}`);
    });

    res = res.map(line => line.join(' '));

    return res;
}

module.exports = {
    parse,
    wrap,
    list,

    img(imgArr, numeral = false) {
        if (!imgArr) {
            return;
        }

        if (typeof imgArr === 'string') {
            imgArr = [imgArr];
        }

        if (!imgArr.length) {
            return;
        }

        let length = 8;

        imgArr = imgArr.map(line => {
            if (line.length > length) {
                length = line.length;
            }

            for (let symbol in imgSymbols) {
                line = line.replace(new RegExp(symbol, 'g'), '\u001b' + imgSymbols[symbol] + ' ' + '\u001b' + alias['/']);
            }

            return line;
        });

        if (numeral) {
            imgArr = imgArr.map((line, i) => {
                return `${formatScaleNumber(i)}${line}`
            });

            let line = parse(`[r][cW] [/]`) +
                Array.from(Array(length).keys()).map(i => formatScaleNumber(i)).join('');

            imgArr.unshift(line);
            imgArr.push(line);
        }

        return imgArr.join('\r\n');
    },
};
