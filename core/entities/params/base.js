const Base = require('../base');

module.exports = class Param extends Base {
    constructor({ level }) {
        super({
            level: parseInt(level),
        });
    }

    get bgColor() {
        return 'bw';
    }

    get textColor() {
        return 'cS';
    }

    get shortName() {
        return this.name.slice(0, 2).toUpperCase();
    }
};
