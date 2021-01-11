const Base = require('../base');

module.exports = class Skill extends Base {
    constructor({ level, progress }) {
        super({
            level: parseInt(level),
            progress: parseFloat(progress),
            max: 100,
        });
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
