const data = {
    tran: {},
    actors: {},
    items: {},
    locations: {},
    attributes: {},
    skills: {},
    params: {},
    commands: [],
};

module.exports = {
    add(collection, key, obj) {
        data[collection][key] = obj;
    },

    remove(collection, obj) {
        delete data[collection][key];
    },

    get(collection, key) {
        if (!key) {
            return data[collection];
        }

        return data[collection][key];
    },

    append(collection, newData) {
        data[collection] = {
            ...data[collection],
            ...newData,
        };
    }
};
