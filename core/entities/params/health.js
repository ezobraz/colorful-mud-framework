const Base = require('./base');

module.exports = class Health extends Base {
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
