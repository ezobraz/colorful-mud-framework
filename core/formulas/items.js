const day = 1000 * 60 * 60 * 24;

module.exports = {
    itemRareColor(rare) {
        switch(rare) {
            case 6: // legendary
                return '[b][cY]';
            case 5: // epic
                return '[b][cM]';
            case 4: // rare
                return '[b][cC]';
            case 3: // uncommon
                return '[b][cG]';
            case 2: // common
                return '[b][cW]';
            case 1: // poor
            default:
                return '';
        }
    },

    itemCondition(item) {
        const quality = parseFloat(item.quality);
        const weight = parseFloat(item.weight);

        const negative = (Date.now() - item.createdOn) / (day * 5);
        let res = quality + (weight / 2.5) - negative;

        if (res < 0) {
            res = 0;
        }

        if (res > 100) {
            res = 100;
        }

        return Math.round(res * 100) / 100;
    },

    itemValue(item) {
        const quality = parseFloat(item.quality);
        const condition = parseFloat(item.condition);
        const rare = parseInt(item.rare);

        let res = (quality * 0.4 + condition * 0.7) * Math.pow(rare, 2);
        return Math.round(res * 100) / 100;
    },
}
