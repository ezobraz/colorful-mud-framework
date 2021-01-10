const Store = require('../store');
const Model = require('../model');
const Debug = require('../engine/debug');

const initLocations = async () => {
    let locationsData = await Model.getters('locations/find', {});

    locationsData.forEach(data => {
        const Location = require(`../entities/locations/${data.className.toLowerCase()}`);
        Store.add('locations', new Location(data));
    });

    return true;
};

module.exports = {
    async init() {
        await initLocations();
        Debug.status('Locations loaded', Store.get('locations').length);
    }
};
