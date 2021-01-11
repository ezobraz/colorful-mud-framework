const data = {
    players: [],
    locations: [],
};

module.exports = {
    add(collection, obj) {
        if (!data[collection].find(o => o === obj)) {
            data[collection].push(obj);
        }
    },

    remove(collection, obj) {
        data[collection] = data[collection].filter(o => o !== obj);
    },

    find(collection, key, value) {
        return data[collection].find(item => item[key] == value);
    },

    findAll(collection, key, value) {
        return data[collection].filter(item => item[key] == value);
    },

    findById(collection, id) {
        return this.find(collection, '_id', id);
    },

    findAllById(collection, id) {
        return this.findAll(collection, '_id', id);
    },

    get(collection) {
        return data[collection];
    }
};
