const state = {
    modules: {
        players: require('./modules/players.js'),
        locations: require('./modules/locations.js'),
        config: require('./modules/config.js'),
    },

    getters(path, data = null) {
        let parts = path.split('/');

        let moduleName = parts[0];
        let func = parts[1];

        return state.modules[moduleName].getters[func](data);
    },

    mutations(path, data = null) {
        let parts = path.split('/');

        let moduleName = parts[0];
        let func = parts[1];

        return state.modules[moduleName].mutations[func](data);
    },
};

module.exports = state;
