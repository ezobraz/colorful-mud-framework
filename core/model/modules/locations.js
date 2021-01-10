const path = require('path');
const Datastore = require('nedb');

const db = new Datastore({
    filename: path.join(__basedir, '/db/locations.db'),
    autoload: true,
});

db.persistence.setAutocompactionInterval( 86400000 );

const state = {
    mutations: {
        async create(params) {
            let res = await new Promise((resolve, reject) => {
                db.insert(params, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });

            return res;
        },

        async save(params) {
            let res = await new Promise((resolve, reject) => {
                db.update({
                    _id: params._id,
                }, { $set: params }, {}, (err, res) => {
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

        async find(params) {
            return await new Promise((resolve, reject) => {
                db.find(params, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        },
    },
};

module.exports = state;
