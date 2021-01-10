const fs = require('fs')
const en = require('../../tran/en');
const Debug = require('../engine/debug');
const Color = require('../common/color');
const Config = require('../config');

let data = en;

const modules = Config.get('modules');
const moduleTrans = {};
modules.forEach(dir => {
    let tranPath = `./modules/${dir}/tran.json`;
    if (fs.existsSync(tranPath)) {
        const tran = require(`../.${tranPath}`);
        for (let key in tran) {
            moduleTrans[key] = moduleTrans[key] || {};
            moduleTrans[key] = {
                ...moduleTrans[key],
                ...tran[key],
            };
        }
    }
});

module.exports = {
    lang: 'en',

    init(lang) {
        if (lang == 'en') {
            return;
        }

        this.lang = lang;
        const langData = require(`../../tran/${lang}.json`);

        data = {
            ...en,
            ...langData,
            ...moduleTrans[lang] || {},
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
