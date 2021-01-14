const Param = __require('core/entities/params/base');

module.exports = class Mana extends Param {
    max(player) {
        // todo
        return 100;
    }

    get bgColor() {
        return 'bb';
    }

    get textColor() {
        return 'cW';
    }

    get shortName() {
        return tran.slate('player-params-mana-short');
    }
};
