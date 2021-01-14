const Store = __require('core/store');
const Dictionary = __require('core/dictionary');
const Model = __require('core/model');
const { Debug } = __require('core/tools');
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
        Debug.status(`${Object.keys(Dictionary.get('locations')).length} Location Classes`, 'loaded');

        let locationsData = await Model.getters('locations/find', {});
        locationsData.forEach(data => {
            const Location = Dictionary.get('locations', data.class.toLowerCase());
            Store.add('locations', new Location(data));
        });

        Debug.status(`${Store.get('locations').length} Locations`, 'loaded');
    }
};
