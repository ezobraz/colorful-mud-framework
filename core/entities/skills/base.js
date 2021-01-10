module.exports = class Base {
    constructor({ level, progress }) {
        this.name = this.constructor.name;
        this.level = level;
        this.progress = progress;
        this.max = 100;
    }

    get cap() {
        return this.level * 100;
    }

    addPoints(points) {
        if (!points) {
            return;
        }

        if (this.progress + points > this.cap && this.level < this.max) {
            this.progress = this.progress + points - this.cap;
            this.level++;
        }
    }
};
