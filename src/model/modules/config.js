const path = require('path');
const Datastore = require('nedb');

const db = new Datastore({
    filename: path.join(__basedir, '/db/config.db'),
    autoload: true,
});

db.persistence.setAutocompactionInterval( 86400000 );

const state = {
    mutations: {
        async save(params) {
            let res = await new Promise((resolve, reject) => {
                db.update({
                    name: params.name,
                }, { $set: params }, {
                    upsert: true,
                }, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });

            if (!res) {
                return null;
            }

            return res;
        },
    },

    getters: {
        async findOne(params) {
            return await new Promise((resolve, reject) => {
                db.findOne(params, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        },
    },
};

module.exports = state;
