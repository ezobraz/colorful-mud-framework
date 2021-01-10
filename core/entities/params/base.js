module.exports = class Base {
    constructor({ level }) {
        this.name = this.constructor.name;
        this.level = parseInt(level);
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
