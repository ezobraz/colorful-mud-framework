const bcrypt = require('bcrypt');

module.exports = {
    async password(password) {
        return await bcrypt.hash(password, 2);
    },

    async compare(password, hash) {
        return await bcrypt.compare(password, hash);
    },
}
