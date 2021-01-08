const Store = require('../store');
const Location = require('../entities/locations');
const Model = require('../model');
const Debug = require('../engine/debug');

const initLocations = async () => {
    let locationsData = await Model.getters('locations/find', {});

    locationsData.forEach(data => {
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
