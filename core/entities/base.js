class Base {
    constructor(params) {
        this.class = this.constructor.name;
        this.createdOn = params.createdOn || Date.now();
        this.meta = {};
        this.tmp = {};
    }
};

module.exports = Base;
