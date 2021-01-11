module.exports = class Base {
    constructor(params) {
        this.type = this.constructor.name;
        this.createdOn = params.createdOn || Date.now();
        this.meta = {};

        for (let i in params) {
            this[i] = params[i];
        }
    }

    get props() {
        const res = {...this};

        delete res.meta;

        return res;
    }
};
