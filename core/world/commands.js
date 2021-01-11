const Debug = require('../engine/debug');
const Dictionary = require('../dictionary');

module.exports = {
    async init() {
        const admin = require('../commands/admin');
        const regular = require('../commands/regular');

        Dictionary.get('commands').push(...[
            ...admin,
            ...regular,
        ]);

        Debug.status('Commands initialized', Dictionary.get('commands').length);
    }
};
