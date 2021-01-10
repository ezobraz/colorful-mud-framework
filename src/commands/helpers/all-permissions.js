let allPermissions = [];
module.exports = () => {
    if (allPermissions.length) {
        return allPermissions;
    }

    const list = require('../list')();

    list.forEach(cmd => {
        if (cmd.permissions) {
            allPermissions.push(...cmd.permissions);
        }
    });

    return allPermissions;
};
