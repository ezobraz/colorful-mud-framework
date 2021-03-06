const en = require('../../tran/en');
const Dictionary = __require('core/dictionary');
const { Color, Debug } = __require('core/tools');

module.exports = {
    lang: 'en',

    init(lang) {
        this.lang = lang;
        const data = {
            ...en,
        };

        if (lang != 'en') {
            data = {...data, ...require(`../../tran/${lang}.json`)};
        }

        let res = Dictionary.append('tran', data);
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
