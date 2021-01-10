const en = require('./en');
const Debug = require('../core/engine/debug');
const Color = require('../core/common/color');

let data = en;

module.exports = {
    lang: 'en',

    init(lang) {
        if (lang == 'en') {
            return;
        }

        this.lang = lang;
        const langData = require(`./${lang}`);

        data = {
            ...en,
            ...langData,
        };
    },

    slate(key, params) {
        let res = data[key];

        if (!res) {
            Debug.log(Color.parse(`No tran found for the key: [b][cY]${key}[/]`), 'WARN');
            return '[NOTRAN]';
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
