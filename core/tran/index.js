const en = require('../../tran/en');
const Debug = require('../engine/debug');
const Color = require('../common/color');
const Dictionary = require('../dictionary');

module.exports = {
    lang: 'en',

    init(lang) {
        if (lang == 'en') {
            return;
        }

        this.lang = lang;
        const langData = require(`../../tran/${lang}.json`);

        let res = Dictionary.append('tran', {
            ...en,
            ...langData,
        });
    },

    slate(key, params) {
        let res = Dictionary.get('tran', key);

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
