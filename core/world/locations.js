const Store = require('../store');
const Dictionary = require('../dictionary');
const Model = require('../model');
const Debug = require('../engine/debug');
const fs = require('fs');

module.exports = {
    async init() {
        await new Promise((resolve, reject) => {
            fs.readdir('./core/entities/locations/', (err, files) => {
                files.forEach(file => {
                    if (file != 'base.js') {
                        const name = file.replace('.js', '');
                        Dictionary.add('locations', name, require(`../entities/locations/${name}`));
                    }
                });

                resolve(true);
            });
        });
        Debug.status('Location types', Object.keys(Dictionary.get('locations')).length);

        let locationsData = await Model.getters('locations/find', {});
        locationsData.forEach(data => {
            const Location = Dictionary.get('locations', data.type.toLowerCase());
            Store.add('locations', new Location(data));
        });

        Debug.status('Locations', Store.get('locations').length);
    }
};
