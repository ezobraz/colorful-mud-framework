const en = require('./en');
const Debug = require('../src/engine/debug');
const Color = require('../src/common/color');

module.exports = {
    lang: en,

    init(lang) {
        if (lang == 'en') {
            return;
        }

        const data = require(`./${lang}`);

        this.lang = {
            ...en,
            ...data,
        };
    },

    slate(key, params) {
        let res = this.lang[key];

        if (!res) {
            Debug.log(Color.parse(`No tran for key: [b][cY]${key}[/]`), 'ERROR');
            return '-- no tran --';
        }

        if (!params) {
            return res;
        }

        for (let i in params) {
            res = res.replace(`{${i}}`, params[i]);
        }

        return res;
    }
};
