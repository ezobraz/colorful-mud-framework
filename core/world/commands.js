const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');

module.exports = {
    async init() {
        const admin = __require('core/commands/admin');

        Dictionary.get('commands').push(...admin);

        Debug.status(`${Dictionary.get('commands').length} Commands`, 'loaded');
    }
};
