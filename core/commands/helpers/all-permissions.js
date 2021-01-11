const Dictionary = require('../../dictionary');
const allPermissions = [];

module.exports = () => {
    if (allPermissions.length) {
        return allPermissions;
    }

    Dictionary.get('commands').forEach(cmd => {
        if (cmd.permissions) {
            allPermissions.push(...cmd.permissions);
        }
    });

    return allPermissions;
};
