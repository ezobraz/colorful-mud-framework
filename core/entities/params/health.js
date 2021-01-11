const Param = require('./base');

module.exports = class Health extends Param {
    max(player) {
        // todo
        return 100;
    }

    get bgColor() {
        return 'br';
    }

    get textColor() {
        return 'cW';
    }

    get shortName() {
        return 'HP';
    }
};
