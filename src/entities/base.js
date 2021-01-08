const Color = require('../common/color');

module.exports = class Base {
    constructor(params = {}) {
        this.props = params;
        this.className = this.constructor.name;
    }

    get dictionary() {
        return {
            createdOn: {
                type: Date,
                default: null,
            },
        }
    }

    get props() {
        const res = {};

        for (let i in this.dictionary) {
            res[i] = this[i];
        }

        res.className = this.className;

        return res;
    }

    set props(params) {
        for (let i in this.dictionary) {
            const dic = this.dictionary[i];
            let val = params[i];

            if (val) {
                if (dic.type === Number) {
                    val = parseFloat(val);

                    if (dic.min && val < dic.min) {
                        val = dic.min;
                    }

                    if (dic.max && val > dic.max) {
                        val = dic.max;
                    }
                }

                if (dic.type === String) {
                    val = val.toString();
                }

                if (dic.type === Date) {
                    val = parseInt(val);
                }

                if (dic.options && !dic.options.includes(val)) {
                    val = dic.default;
                }

            } else {
                val = dic.default;

                if (!val && dic.type === Date) {
                    val = Date.now();
                }
            }

            this[i] = val;
        }
    }
};
