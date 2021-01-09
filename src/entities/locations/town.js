const Location = require('./index');

module.exports = class Town extends Location {
    get color() {
        return 'cY';
    }
};
