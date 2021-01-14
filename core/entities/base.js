class Base {
    constructor(params) {
        this.class = this.constructor.name;
        this.createdOn = params.createdOn || Date.now();
        this.meta = {};
    }

    get props() {
        const res = {...this};

        delete res.meta;

        return res;
    }
};

module.exports = Base;
